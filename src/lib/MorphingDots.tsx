"use client";

import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from "react";

type Dot = {
  xPercent: number; // 0..100 relative to svg width
  yPercent: number; // 0..100 relative to svg height
  rPercentOfWidth: number; // radius relative to svg width (percentage)
  rPx: number; // original svg radius in px (svg coordinate system)
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
  transitionMs?: number;
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
  transitionMs = 650,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerW, height: containerH } = useContainerSize(containerRef);

  const [shapes, setShapes] = useState<Shape[]>([]);
  const [internalActiveId, setInternalActiveId] = useState<string | null>(null);
  const introLockRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const introInProgressRef = useRef<boolean>(false);

  // Load and parse all SVG sources once on mount or when sources change
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results: Shape[] = [];
      for (const s of sources) {
        try {
          const res = await fetch(s.url, { cache: "force-cache" });
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
  }, [JSON.stringify(sources)]);

  // Always play an intro-from-center once shapes are ready or sources change
  const introKey = useMemo(() => JSON.stringify(sources), [sources]);
  useEffect(() => {
    if (shapes.length === 0) return;
    // Start centered
    introInProgressRef.current = true;
    setInternalActiveId(null);
    if (introLockRef.current) clearTimeout(introLockRef.current);
    // Ensure one frame renders with centered dots, then activate
    introLockRef.current = setTimeout(() => {
      setInternalActiveId(activeId);
      introInProgressRef.current = false;
    }, 30);
    return () => {
      if (introLockRef.current) clearTimeout(introLockRef.current);
      introInProgressRef.current = false;
    };
  }, [introKey, shapes.length]);

  // Normal updates when activeId changes (e.g., hover) without forcing center reset
  useEffect(() => {
    if (shapes.length === 0) return;
    // Even if intro is in progress, capture the latest activeId so it will appear
    setInternalActiveId(activeId);
  }, [activeId, shapes.length]);

  const activeShape = useMemo(() => shapes.find((s) => s.id === internalActiveId) || null, [shapes, internalActiveId]);

  const masterCount = useMemo(() => shapes.reduce((m, s) => Math.max(m, s.dots.length), 0), [shapes]);

  // Prepare per-index target dot for current active shape
  const targetDots = useMemo(() => {
    if (!activeShape && shapes.length > 0) {
      // No active: place dots in center and transparent
      return Array.from({ length: masterCount }).map(() => ({ xPercent: 50, yPercent: 50, rPercentOfWidth: 3, rPx: 3 } as Dot));
    }
    if (!activeShape) return [] as Dot[];
    const list = [...activeShape.dots];
    // If fewer than master, pad with center points
    while (list.length < masterCount) list.push({ xPercent: 50, yPercent: 50, rPercentOfWidth: 3, rPx: 3 });
    return list;
  }, [activeShape, masterCount, shapes.length]);

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
          if (activeShape) {
            const scale = Math.min(W / activeShape.svgWidth, H / activeShape.svgHeight);
            const offsetX = (W - activeShape.svgWidth * scale) / 2;
            const offsetY = (H - activeShape.svgHeight * scale) / 2;
            const cxSvg = (dot?.xPercent || 50) / 100 * activeShape.svgWidth;
            const cySvg = (dot?.yPercent || 50) / 100 * activeShape.svgHeight;
            // Use each dot's original radius scaled by the active shape's scale
            const rScaled = Math.max(1, (dot?.rPx || 0) * scale);
            diameterPx = 2 * rScaled;
            x = offsetX + cxSvg * scale - diameterPx / 2;
            y = offsetY + cySvg * scale - diameterPx / 2;
            visible = i < (activeShape?.dots.length || 0);
          }
          const style: CSSProperties = {
            position: "absolute",
            left: 0,
            top: 0,
            transform: `translate(${x}px, ${y}px)`,
            width: diameterPx,
            height: diameterPx,
            borderRadius: "9999px",
            background: dotColor,
            opacity: visible ? dotOpacity : 0,
            transition: `transform ${transitionMs}ms ease, opacity ${transitionMs}ms ease`,
          };
          return <span key={i} style={style} />;
        })}
      </div>
    </div>
  );
};

export default MorphingDots;


