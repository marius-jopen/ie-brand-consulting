"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const FULL_TEXT = "itir eraslan.";
const TARGET_TEXT = "ie.";

// Animation timing configuration
// Two speeds only: one for forward, one for reverse
const START_PAUSE_MS = 200;       // pause before the first letter appears
const FORWARD_DELAY_MS = 250;     // fixed delay per letter (forward)
const REVERSE_DELAY_MS = 70;      // fixed delay per step (reverse)

export default function Opener() {
  const [phase, setPhase] = useState<"idle" | "forward" | "reverse">("idle");
  const [text, setText] = useState<string>("");
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const onClick = useCallback(() => {
    clearTimer();
    if (phase === "idle" || phase === "reverse") {
      setText("");
      setPhase("forward");
    } else if (phase === "forward") {
      setPhase("reverse");
    }
  }, [phase]);

  // Forward: i -> it -> ... -> itir eraslan.
  useEffect(() => {
    if (phase !== "forward") return;
    let i = 0;
    const step = () => {
      i += 1;
      setText(FULL_TEXT.slice(0, i));
      if (i < FULL_TEXT.length) {
        timerRef.current = window.setTimeout(step, FORWARD_DELAY_MS);
      }
    };
    timerRef.current = window.setTimeout(step, START_PAUSE_MS);
    return clearTimer;
  }, [phase]);

  // Reverse: itir eraslan. -> ... -> ie.
  const reverseStep = (s: string): string => {
    if (s === TARGET_TEXT) return s;
    const dot = s.lastIndexOf(".");
    if (dot === -1) return TARGET_TEXT;

    // If we are at "itir e.", first remove the space: "itire."
    if (s.includes(" e.")) return s.replace(" e.", "e.");

    // If we already have "e." at the end, remove the char immediately before 'e'
    const eDotIdx = s.lastIndexOf("e.");
    if (eDotIdx !== -1) {
      const pre = eDotIdx - 1;
      if (pre >= 0) return s.slice(0, pre) + s.slice(eDotIdx);
    }

    // Default: remove the char immediately before the dot
    if (dot - 1 >= 0) return s.slice(0, dot - 1) + s.slice(dot);
    return TARGET_TEXT;
  };

  useEffect(() => {
    if (phase !== "reverse") return;
    let current = text && text.length > 0 ? text : FULL_TEXT;
    setText(current);
    const tick = () => {
      current = reverseStep(current);
      setText(current);
      if (current !== TARGET_TEXT) {
        timerRef.current = window.setTimeout(tick, REVERSE_DELAY_MS);
      }
    };
    timerRef.current = window.setTimeout(tick, START_PAUSE_MS);
    return clearTimer;
  }, [phase]);

  return (
    <div
      className="relative w-full flex items-center justify-center select-none py-20 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="whitespace-pre text-h1">{text}</div>
    </div>
  );
}

