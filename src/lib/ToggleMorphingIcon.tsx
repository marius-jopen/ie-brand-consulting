"use client";

import { FC, KeyboardEvent, useMemo, useState, useEffect, useRef } from "react";
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
  trigger?: "click" | "hover" | "viewport";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Handle viewport trigger for mobile only
  useEffect(() => {
    if (trigger !== "viewport") return;

    const isMobile = () => window.innerWidth < 768; // md breakpoint
    
    if (!isMobile()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setUseFirst(!initialIsFirst);
            setHasAnimated(true);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [trigger, hasAnimated, initialIsFirst]);

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

  const onMouseEnter = () => {
    if (trigger !== "hover") return;
    setUseFirst(!initialIsFirst);
  };

  const onMouseLeave = () => {
    if (trigger !== "hover") return;
    setUseFirst(initialIsFirst);
  };

  return (
    <div
      ref={containerRef}
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


