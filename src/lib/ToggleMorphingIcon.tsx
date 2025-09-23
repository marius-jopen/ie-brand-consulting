"use client";

import { FC, KeyboardEvent, useMemo, useState } from "react";
import MorphingDots from "@/lib/MorphingDots";
export type ToggleMorphingIconProps = {
  width?: number | string;
  height?: number | string;
  dotColor?: string;
  dotOpacity?: number;
  transitionMs?: number;
  className?: string;
  palette?: Array<{ id: string; url: string }>;
  firstId?: string;
  secondId?: string;
  initial?: "first" | "second";
  wrapperClassName?: string;
};

const ToggleMorphingIcon: FC<ToggleMorphingIconProps> = ({
  firstId = "circle",
  secondId = "read",
  initial = "first",
  wrapperClassName,
  ...rest
}) => {
  const [useFirst, setUseFirst] = useState(initial === "first");
  const activeId = useFirst ? firstId : secondId;

  const DEFAULT_PALETTE: Array<{ id: string; url: string }> = useMemo(() => ([
    { id: "listen", url: "/svgs/listen.svg" },
    { id: "read", url: "/svgs/read.svg" },
    { id: "watch", url: "/svgs/watch.svg" },
    { id: "speak", url: "/svgs/speak.svg" },
    { id: "design-1", url: "/svgs/design-1.svg" },
    { id: "marketing-2", url: "/svgs/marketing-2.svg" },
    { id: "strategy-3", url: "/svgs/strategy-3.svg" },
    { id: "circle", url: "/svgs/circle.svg" },
  ]), []);

  const palette = (rest.palette && rest.palette.length > 0) ? rest.palette : DEFAULT_PALETTE;
  const sources = useMemo(() => {
    const ids = Array.from(new Set([firstId, secondId]));
    return ids.map((id) => palette.find((p) => p.id === id)).filter(Boolean) as Array<{ id: string; url: string }>;
  }, [palette, firstId, secondId]);

  const toggle = () => setUseFirst((v) => !v);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={!useFirst}
      onClick={toggle}
      onKeyDown={onKeyDown}
      className={wrapperClassName ? `${wrapperClassName} cursor-pointer` : "cursor-pointer"}
      style={{ width: "100%", height: "100%" }}
    >
      <MorphingDots
        sources={sources}
        activeId={activeId}
        width={rest.width ?? "100%"}
        height={rest.height ?? "100%"}
        dotColor={rest.dotColor}
        dotOpacity={rest.dotOpacity}
        transitionMs={rest.transitionMs}
        className={rest.className}
      />
    </div>
  );
};

export default ToggleMorphingIcon;


