"use client";

import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from "react";

type Dot = {
  xPercent: number; // 0..100 relative to svg width
  yPercent: number; // 0..100 relative to svg height
  rPercentOfWidth: number; // radius relative to svg width (percentage)
  rPx: number; // original svg radius in px (svg coordinate system)
  ghost?: boolean; // placeholder dot (not a real shape dot)
};

type Shape = {
  id: string;
  dots: Dot[];
  svgWidth: number;
  svgHeight: number;
  baseRadiusPx: number; // typical radius for this shape
};

export type MorphingDotsProps = {
  sources: Array<{ id: string; url: string }>;
  activeId?: string | null;
  width?: number | string; // px or CSS size (e.g., '60vw')
  height?: number | string; // px or CSS size
  dotColor?: string;
  dotOpacity?: number; // 0..1
  // Movement duration for dot positions and sizes
  moveTransitionMs?: number;
  // Fade duration for dot opacity changes
  fadeTransitionMs?: number;
  className?: string;
};

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function parseSvgTextToShape(id: string, svgText: string): Shape | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");

    const svgEl = doc.querySelector("svg");
    if (!svgEl) return null;

    const widthAttr = svgEl.getAttribute("width");
    const heightAttr = svgEl.getAttribute("height");
    const viewBoxAttr = svgEl.getAttribute("viewBox");

    let width = widthAttr ? parseFloat(widthAttr) : undefined;
    let height = heightAttr ? parseFloat(heightAttr) : undefined;

    if ((!width || !height) && viewBoxAttr) {
      const parts = viewBoxAttr.split(/\s+/).map((p) => parseFloat(p));
      if (parts.length === 4) {
        width = parts[2];
        height = parts[3];
      }
    }

    if (!width || !height) {
      return null;
    }

    const ellipses = Array.from(doc.querySelectorAll("ellipse"));
    const circles = Array.from(doc.querySelectorAll("circle"));

    const dotsEllipse: Dot[] = ellipses.map((el) => {
      const cx = parseFloat(el.getAttribute("cx") || "0");
      const cy = parseFloat(el.getAttribute("cy") || "0");
      const rx = parseFloat(el.getAttribute("rx") || "0");
      const ry = parseFloat(el.getAttribute("ry") || "0");
      const r = (rx + ry) / 2;
      return {
        xPercent: (cx / width) * 100,
        yPercent: (cy / height) * 100,
        rPercentOfWidth: (r / width) * 100,
        rPx: r,
        ghost: false,
      } as Dot;
    });

    const dotsCircle: Dot[] = circles.map((el) => {
      const cx = parseFloat(el.getAttribute("cx") || "0");
      const cy = parseFloat(el.getAttribute("cy") || "0");
      const r = parseFloat(el.getAttribute("r") || "0");
      return {
        xPercent: (cx / width) * 100,
        yPercent: (cy / height) * 100,
        rPercentOfWidth: (r / width) * 100,
        rPx: r,
        ghost: false,
      } as Dot;
    });

    const dots: Dot[] = [...dotsEllipse, ...dotsCircle]
      // Stable sort for deterministic mapping: by y then x
      .sort((a, b) => (a.yPercent - b.yPercent) || (a.xPercent - b.xPercent));

    const baseRadiusPx = median(dots.map((d) => d.rPx));
    return { id, dots, svgWidth: width, svgHeight: height, baseRadiusPx };
  } catch {
    return null;
  }
}

const useContainerSize = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const resize = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    window.addEventListener("resize", resize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [ref]);
  return size;
};

export const MorphingDots: FC<MorphingDotsProps> = ({
  sources,
  activeId = null,
  width,
  height,
  dotColor = "#E4E1DB",
  dotOpacity = 1,
  moveTransitionMs = 650,
  fadeTransitionMs = 650,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerW, height: containerH } = useContainerSize(containerRef);

  const [shapes, setShapes] = useState<Shape[]>([]);
  const [internalActiveId, setInternalActiveId] = useState<string | null>(null);
  const pendingActiveIdRef = useRef<string | null>(null);
  // removed RAF-based one-frame reset to avoid visual gap when switching shapes
  const prevInternalActiveIdRef = useRef<string | null>(null);
  const holdOnNullIdRef = useRef<number | null>(null);
  const [holdOnNullId, setHoldOnNullId] = useState<string | null>(null);
  // Keep the previously displayed shape and dot ordering to compute stable mappings
  const prevDisplayShapeRef = useRef<Shape | null>(null);
  const prevOrderedDotsRef = useRef<Dot[]>([]);
  const [orderedTargetDots, setOrderedTargetDots] = useState<Dot[]>([]);

  // Load and parse all SVG sources when sources change
  useEffect(() => {
    let cancelled = false;
    setShapes([]);
    (async () => {
      const results: Shape[] = [];
      for (const s of sources) {
        try {
          const res = await fetch(s.url, { cache: "no-store" });
          const text = await res.text();
          const shape = parseSvgTextToShape(s.id, text);
          if (shape) results.push(shape);
        } catch {
          // ignore
        }
      }
      if (!cancelled) setShapes(results);
    })();
    return () => {
      cancelled = true;
    };
  }, [sources]);

  // Update internal active id only when the target shape is loaded; otherwise defer
  useEffect(() => {
    if (activeId == null) {
      pendingActiveIdRef.current = null;
      setInternalActiveId(null);
      return;
    }
    const hasTarget = shapes.some((s) => s.id === activeId);
    if (hasTarget) {
      pendingActiveIdRef.current = null;
      setInternalActiveId(activeId);
    } else {
      pendingActiveIdRef.current = activeId;
      // Do not change internalActiveId yet; wait until the shape loads
    }
  }, [activeId, shapes]);

  // When shapes load, if there is a deferred target pending, activate it once available
  useEffect(() => {
    if (!pendingActiveIdRef.current) return;
    const hasPending = shapes.some((s) => s.id === pendingActiveIdRef.current);
    if (hasPending) {
      setInternalActiveId(pendingActiveIdRef.current);
      pendingActiveIdRef.current = null;
    }
  }, [shapes]);

  // When deactivating to "no shape", keep previous shape positions for the duration
  // of the fade-out so dots don't fly away. This applies to all shapes.
  useEffect(() => {
    const prev = prevInternalActiveIdRef.current;
    const isNowNull = internalActiveId == null;
    if (prev != null && isNowNull) {
      setHoldOnNullId(prev);
      if (holdOnNullIdRef.current) window.clearTimeout(holdOnNullIdRef.current);
      holdOnNullIdRef.current = window.setTimeout(() => {
        setHoldOnNullId(null);
      }, Math.max(fadeTransitionMs, moveTransitionMs)) as unknown as number;
    } else if (!isNowNull) {
      // If activating another shape, drop any hold
      if (holdOnNullIdRef.current) window.clearTimeout(holdOnNullIdRef.current);
      setHoldOnNullId(null);
    }
    prevInternalActiveIdRef.current = internalActiveId;
    return () => {
      // no-op
    };
  }, [internalActiveId, fadeTransitionMs, moveTransitionMs]);

  useEffect(() => {
    return () => {
      if (holdOnNullIdRef.current) window.clearTimeout(holdOnNullIdRef.current);
    };
  }, []);

  const displayShape = useMemo(() => {
    const idToUse = internalActiveId ?? holdOnNullId;
    return shapes.find((s) => s.id === idToUse) || null;
  }, [shapes, internalActiveId, holdOnNullId]);

  const masterCount = useMemo(() => shapes.reduce((m, s) => Math.max(m, s.dots.length), 0), [shapes]);

  // Helpers for mapping
  const dist2 = (a: Dot, b: Dot) => {
    const dx = (a.xPercent - b.xPercent);
    const dy = (a.yPercent - b.yPercent);
    return dx * dx + dy * dy;
  };

  const padDots = (dots: Dot[], count: number) => {
    const list = [...dots];
    while (list.length < count) list.push({ xPercent: 50, yPercent: 50, rPercentOfWidth: 3, rPx: 3, ghost: true });
    return list;
  };

  // Compute ordered target dots whenever the active shape changes
  useEffect(() => {
    // No shapes yet: reset
    if (shapes.length === 0) {
      setOrderedTargetDots([]);
      prevOrderedDotsRef.current = [];
      prevDisplayShapeRef.current = null;
      return;
    }

    // No active shape: all dots at center
    if (!displayShape) {
      const center = Array.from({ length: masterCount }).map(() => ({ xPercent: 50, yPercent: 50, rPercentOfWidth: 3, rPx: 3, ghost: true } as Dot));
      setOrderedTargetDots(center);
      // Do not update prev references when no active shape
      return;
    }

    // First activation: use the shape's native order padded
    if (!prevDisplayShapeRef.current || prevOrderedDotsRef.current.length === 0) {
      const nextDots = padDots(displayShape.dots, masterCount);
      setOrderedTargetDots(nextDots);
      prevOrderedDotsRef.current = nextDots;
      prevDisplayShapeRef.current = displayShape;
      return;
    }

    // Transition: compute a nearest-neighbor mapping from previous ordering to new shape
    const prevDots = padDots(prevOrderedDotsRef.current, masterCount);
    const rawNextDots = padDots(displayShape.dots, masterCount);

    // Special-case heuristic: circle -> question leg reservation
    const prevId = prevDisplayShapeRef.current?.id ?? "";
    const nextId = displayShape.id;
    const isCircleToQuestion = /circle/i.test(prevId) && /question/i.test(nextId);

    const used = new Array(rawNextDots.length).fill(false);
    const result: Dot[] = new Array(masterCount);

    const reserveIndexes = (indicesPrev: number[], predicateNext: (d: Dot) => boolean) => {
      const candidateNextIdxs = rawNextDots.map((d, idx) => ({ d, idx })).filter(({ d, idx }) => !used[idx] && predicateNext(d));
      for (const i of indicesPrev) {
        const prev = prevDots[i];
        if (!prev) continue;
        let bestIdx = -1;
        let bestD2 = Infinity;
        for (const { d, idx } of candidateNextIdxs) {
          if (used[idx]) continue;
          const d2 = dist2(prev, d);
          if (d2 < bestD2) {
            bestD2 = d2;
            bestIdx = idx;
          }
        }
        if (bestIdx !== -1) {
          result[i] = rawNextDots[bestIdx];
          used[bestIdx] = true;
        }
      }
    };

    if (isCircleToQuestion) {
      // Choose a left-side cohort from the circle to become the leg
      const leftPrevIdxs = prevDots
        .map((d, i) => ({ d, i }))
        .filter(({ d }) => d.xPercent < 45)
        .sort((a, b) => a.d.xPercent - b.d.xPercent)
        .slice(0, Math.max(1, Math.floor(masterCount * 0.18)))
        .map(({ i }) => i);

      // Leg region: bottom-ish cluster in the question mark
      const legPredicate = (d: Dot) => d.yPercent > 80 && Math.abs(d.xPercent - 50) < 20;
      reserveIndexes(leftPrevIdxs, legPredicate);
    }

    // Greedy nearest-neighbor for remaining indices
    for (let i = 0; i < masterCount; i++) {
      if (result[i]) continue;
      const prev = prevDots[i];
      let bestIdx = -1;
      let bestD2 = Infinity;
      for (let j = 0; j < rawNextDots.length; j++) {
        if (used[j]) continue;
        const d2 = dist2(prev, rawNextDots[j]);
        if (d2 < bestD2) {
          bestD2 = d2;
          bestIdx = j;
        }
      }
      if (bestIdx !== -1) {
        result[i] = rawNextDots[bestIdx];
        used[bestIdx] = true;
      } else {
        // Fallback to center if somehow we ran out of targets
        result[i] = { xPercent: 50, yPercent: 50, rPercentOfWidth: 3, rPx: 3, ghost: true };
      }
    }

    setOrderedTargetDots(result);
    prevOrderedDotsRef.current = result;
    prevDisplayShapeRef.current = displayShape;
  }, [displayShape, masterCount, shapes.length]);

  // The array used by renderer
  const targetDots = orderedTargetDots;

  const numericWidth = typeof width === "number" ? width : 0;
  const numericHeight = typeof height === "number" ? height : 0;
  let W = containerW || numericWidth;
  let H = containerH || numericHeight;
  if (W > 0 && H === 0) H = W; // default square if height missing
  if (H > 0 && W === 0) W = H; // default square if width missing

  // We size each dot based on its original SVG radius scaled by the active shape's scale

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: width !== undefined ? (typeof width === "number" ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === "number" ? `${height}px` : height) : undefined,
      }}
    >
      {/* Render a fixed number of dots and move them to their targets */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: masterCount }).map((_, i) => {
          const dot = targetDots[i];

          // Default diameter when no active shape: small center dots
          let diameterPx = 6;
          let x = W / 2 - diameterPx / 2;
          let y = H / 2 - diameterPx / 2;
          let visible = false;
          if (displayShape) {
            const scale = Math.min(W / displayShape.svgWidth, H / displayShape.svgHeight);
            const offsetX = (W - displayShape.svgWidth * scale) / 2;
            const offsetY = (H - displayShape.svgHeight * scale) / 2;
            const cxSvg = (dot?.xPercent || 50) / 100 * displayShape.svgWidth;
            const cySvg = (dot?.yPercent || 50) / 100 * displayShape.svgHeight;
            // Use each dot's original radius scaled by the active shape's scale
            const rScaled = Math.max(1, (dot?.rPx || 0) * scale);
            diameterPx = 2 * rScaled;
            x = offsetX + cxSvg * scale - diameterPx / 2;
            y = offsetY + cySvg * scale - diameterPx / 2;
            visible = !!dot && dot.ghost !== true;

            // Smooth radial fly-out on exit (keep transform animated while fading)
            const isExiting = holdOnNullId != null && internalActiveId == null;
            if (isExiting) {
              const centerX = W / 2;
              const centerY = H / 2;
              const dotCenterX = x + diameterPx / 2;
              const dotCenterY = y + diameterPx / 2;
              const dx = dotCenterX - centerX;
              const dy = dotCenterY - centerY;
              // Deterministic pseudo-random jitter per index (no re-renders)
              const seed = Math.sin((i + 1) * 12.9898) * 43758.5453;
              const frac = seed - Math.floor(seed);
              const jitter = (frac * 2 - 1);
              const radialScale = 1.25 + jitter * 0.15; // 25% outward push + variance
              const driftX = (W * 0.015) * jitter; // small horizontal drift
              const driftY = (H * 0.02) * (1 - Math.abs(jitter)); // small vertical drift
              const targetX = centerX + dx * radialScale + driftX;
              const targetY = centerY + dy * radialScale + driftY;
              x = targetX - diameterPx / 2;
              y = targetY - diameterPx / 2;
            }
          }
          const isExiting = holdOnNullId != null && internalActiveId == null;
          const transformMs = moveTransitionMs; // keep transform animated even when exiting
          const style: CSSProperties = {
            position: "absolute",
            left: 0,
            top: 0,
            transform: `translate(${x}px, ${y}px)`,
            width: diameterPx,
            height: diameterPx,
            borderRadius: "9999px",
            background: dotColor,
            opacity: visible ? (isExiting ? 0 : dotOpacity) : 0,
            transition: `transform ${transformMs}ms cubic-bezier(.22,.61,.36,1), opacity ${fadeTransitionMs}ms cubic-bezier(.22,.61,.36,1)`,
            willChange: "transform, opacity",
          };
          return <span key={i} style={style} />;
        })}
      </div>
    </div>
  );
};

export default MorphingDots;


