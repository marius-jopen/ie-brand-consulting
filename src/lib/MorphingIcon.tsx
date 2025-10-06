"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import MorphingDots from "@/lib/MorphingDots";

export type MorphingIconProps = {
  keyword?: string | null;
  width?: number | string;
  height?: number | string;
  dotColor?: string;
  dotOpacity?: number;
  transitionMs?: number;
  className?: string;
  palette?: Array<{ id: string; url: string }>;
};

const DEFAULT_PALETTE: Array<{ id: string; url: string }> = [
  { id: "listen", url: "/svgs/listen.svg" },
  { id: "read", url: "/svgs/read.svg" },
  { id: "watch", url: "/svgs/watch.svg" },
  { id: "speak", url: "/svgs/speak.svg" },
  { id: "design-1", url: "/svgs/design-1.svg" },
  { id: "marketing-2", url: "/svgs/marketing-2.svg" },
  { id: "strategy-3", url: "/svgs/strategy-3.svg" },
  { id: "circle", url: "/svgs/circle.svg" },
];

function normalizeKeyword(input?: string | null): string | null {
  if (!input) return null;
  const k = input.toString().trim().toLowerCase();
  if (!k) return null;
  // Map common synonyms to palette ids
  if (k === "design") return "design-1";
  if (k === "marketing") return "marketing-2";
  if (k === "strategy") return "strategy-3";
  return k;
}

const MorphingIcon: FC<MorphingIconProps> = ({
  keyword,
  width = "100%",
  height = "100%",
  dotColor = "#E4E1DB",
  dotOpacity = 1,
  transitionMs = 650,
  className,
  palette,
}) => {
  const pathname = usePathname();
  const usablePalette = palette && palette.length > 0 ? palette : DEFAULT_PALETTE;

  const normalized = useMemo(() => normalizeKeyword(keyword), [keyword]);
  const chosen = useMemo(() => {
    const byId = usablePalette.find((p) => p.id === normalized);
    if (byId) return byId;
    // Also try to match by filename without extension
    const byLoose = usablePalette.find((p) => p.id.includes(normalized || ""));
    return byLoose || usablePalette.find((p) => p.id === "circle") || usablePalette[0];
  }, [usablePalette, normalized]);

  const sources = useMemo(() => [{ id: chosen.id, url: chosen.url }], [chosen]);
  const morphKey = useMemo(() => `${pathname || ""}-${chosen.id}`, [pathname, chosen.id]);

  // Drive mount animation: start centered (no active) then activate selected id
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    // Force a fresh start even if React reuses the component instance across routes
    setActiveId(null);
    const t = setTimeout(() => setActiveId(chosen.id), 50);
    return () => clearTimeout(t);
  }, [chosen.id, pathname]);

  // Optional: allow consumers to force remount via key changes without code changes here

  return (
    <div className={className} style={{ position: "relative", width: typeof width === "number" ? `${width}px` : width, height: typeof height === "number" ? `${height}px` : height }}>
      <MorphingDots
        key={morphKey}
        sources={sources}
        activeId={activeId}
        width="100%"
        height="100%"
        dotColor={dotColor}
        dotOpacity={dotOpacity}
        moveTransitionMs={transitionMs}
        fadeTransitionMs={transitionMs}
      />
    </div>
  );
};

export default MorphingIcon;


