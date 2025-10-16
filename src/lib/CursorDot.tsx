"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "[role=button]",
  "input",
  "select",
  "textarea",
  "label",
  "summary",
  ".cursor-pointer",
  "[data-cursor-invert]",
].join(",");

export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    let x = 0;
    let y = 0;
    let rafId = 0;
    let scheduled = false;
    let shown = false;

    const applyPosition = () => {
      scheduled = false;
      // Position via left/top to preserve centering via translate(-50%, -50%)
      dot.style.left = x + "px";
      dot.style.top = y + "px";
    };

    const scheduleRender = () => {
      if (scheduled) return;
      scheduled = true;
      rafId = requestAnimationFrame(applyPosition);
    };

    const updateInvertState = (target: EventTarget | null) => {
      const el = target as Element | null;
      const isInteractive = !!el && !!el.closest && !!el.closest(INTERACTIVE_SELECTOR);
      if (isInteractive) {
        dot.classList.add("is-invert");
      } else {
        dot.classList.remove("is-invert");
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      // Only show for fine pointers (mouse/pen). Touch will be ignored.
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;

      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        dot.style.opacity = "1";
        shown = true;
      }
      scheduleRender();
      updateInvertState(e.target);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      updateInvertState(e.target);
    };

    const onMouseLeave = () => {
      dot.style.opacity = "0";
      shown = false;
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("mouseout", onMouseLeave, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("pointermove", onPointerMove as any);
      document.removeEventListener("pointerdown", onPointerDown as any);
      window.removeEventListener("mouseout", onMouseLeave as any);
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
}


