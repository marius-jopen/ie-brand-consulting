"use client";

import { FC, KeyboardEvent, MouseEvent as ReactMouseEvent, useMemo, useState } from "react";
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
  trigger?: "click" | "hover";
};

const ToggleMorphingIcon: FC<ToggleMorphingIconProps> = ({
  firstId = "circle",
  secondId = "read",
  initial = "first",
  wrapperClassName,
  trigger = "click",
  ...rest
}) => {
  const [useFirst, setUseFirst] = useState(initial === "first");
  const initialIsFirst = initial === "first";
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
    if (trigger !== "click") return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  const onMouseEnter = (_e: ReactMouseEvent<HTMLDivElement>) => {
    if (trigger !== "hover") return;
    setUseFirst(!initialIsFirst);
  };

  const onMouseLeave = (_e: ReactMouseEvent<HTMLDivElement>) => {
    if (trigger !== "hover") return;
    setUseFirst(initialIsFirst);
  };

  return (
    <div
      role={trigger === "click" ? "button" : undefined}
      tabIndex={trigger === "click" ? 0 : undefined}
      aria-pressed={trigger === "click" ? !useFirst : undefined}
      onClick={trigger === "click" ? toggle : undefined}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={wrapperClassName ? `${wrapperClassName} ${trigger === "click" ? "cursor-pointer" : ""}` : (trigger === "click" ? "cursor-pointer" : undefined)}
      style={{ width: "100%", height: "100%" }}
    >
      <MorphingDots
        sources={sources}
        activeId={activeId}
        width={rest.width ?? "100%"}
        height={rest.height ?? "100%"}
        dotColor={rest.dotColor}
        dotOpacity={rest.dotOpacity}
        moveTransitionMs={rest.transitionMs}
        fadeTransitionMs={rest.transitionMs}
        className={rest.className}
      />
    </div>
  );
};

export default ToggleMorphingIcon;


