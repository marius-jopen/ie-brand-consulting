"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const FULL_TEXT = "itir eraslan.";
const TARGET_TEXT = "ie.";

// Animation timing configuration
// Two speeds only: one for forward, one for reverse
const FORWARD_START_DELAY_MS = 500; // delay before the first letter appears (non-hover autoplay)
const FORWARD_DELAY_MS = 150;      // fixed delay per letter (forward)
const REVERSE_START_DELAY_MS = 0;  // start reverse immediately
const REVERSE_DELAY_MS = 60;       // fixed delay per step (reverse)
const AUTOPLAY_REVERSE_PAUSE_MS = 1000; // pause before starting reverse in autoplay mode
const WORD_BREAK_EXTRA_MS = 400;   // extra pause when showing the space between words

type OpenerProps = {
  startFromIE?: boolean;
  className?: string;
  textClassName?: string;
  onFinished?: () => void;
};

export default function Opener({ startFromIE = false, className, textClassName, onFinished }: OpenerProps) {
  const [phase, setPhase] = useState<"idle" | "forward" | "reverse">("idle");
  const [text, setText] = useState<string>("");
  const timerRef = useRef<number | null>(null);
  const desiredEndTextRef = useRef<string | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Hover handlers only used when startFromIE is true
  const onMouseEnter = useCallback(() => {
    if (!startFromIE) return;
    desiredEndTextRef.current = FULL_TEXT;
    clearTimer();
    if (text !== FULL_TEXT) setPhase("forward");
  }, [startFromIE, text]);

  const onMouseLeave = useCallback(() => {
    if (!startFromIE) return;
    desiredEndTextRef.current = TARGET_TEXT;
    clearTimer();
    if (text !== TARGET_TEXT) setPhase("reverse");
  }, [startFromIE, text]);

  // Initialize display based on mode
  useEffect(() => {
    if (startFromIE) {
      if (text === "") setText(TARGET_TEXT);
    } else {
      // Autoplay once on mount when not in hover mode
      if (phase === "idle" && text === "") {
        setPhase("forward");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startFromIE]);

  // Forward
  useEffect(() => {
    if (phase !== "forward") return;
    if (startFromIE) {
      // Custom sequence starting from "ie." and inserting characters before the final "e."
      // Sequence as requested:
      // ie. → ite. → itie. → itire. → itir e. → itir er. → itir era. → itir eras. → itir erasl. → itir erasla. → itir eraslan.
      const sequence = [
        "ie.",
        "ite.",
        "itie.",
        "itire.",
        "itir e.",
        "itir er.",
        "itir era.",
        "itir eras.",
        "itir erasl.",
        "itir erasla.",
        "itir eraslan.",
      ];
      // Continue from current position in the sequence (do not restart)
      const currentIndex = sequence.indexOf(text);
      let idx = (currentIndex >= 0 ? currentIndex + 1 : 0);
      const tick = () => {
        setText(sequence[idx]);
        idx += 1;
        if (idx < sequence.length) {
          // Hover mode: no extra pause at word break
          timerRef.current = window.setTimeout(tick, FORWARD_DELAY_MS);
        } else {
          setPhase("idle");
          // If a different end state was requested during animation, continue toward it
          const desired = desiredEndTextRef.current;
          if (desired && desired !== sequence[sequence.length - 1]) {
            setPhase(desired === FULL_TEXT ? "forward" : "reverse");
          }
        }
      };
      if (idx >= sequence.length) {
        setPhase("idle");
        return () => {};
      }
      // In hover mode we start immediately
      timerRef.current = window.setTimeout(tick, 0);
      return () => {};
    }
    // Default: i -> it -> ... -> itir eraslan.
    let i = 0;
    const step = () => {
      i += 1;
      setText(FULL_TEXT.slice(0, i));
      if (i < FULL_TEXT.length) {
        const justAddedChar = FULL_TEXT[i - 1];
        const delay = FORWARD_DELAY_MS + (justAddedChar === " " ? WORD_BREAK_EXTRA_MS : 0);
        timerRef.current = window.setTimeout(step, delay);
      } else {
        // In autoplay mode (startFromIE === false), wait before reversing
        timerRef.current = window.setTimeout(() => {
          setPhase("reverse");
        }, AUTOPLAY_REVERSE_PAUSE_MS);
      }
    };
    // In autoplay mode we delay the first letter
    timerRef.current = window.setTimeout(step, FORWARD_START_DELAY_MS);
    return clearTimer;
  }, [phase, startFromIE]);

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
      } else {
        setPhase("idle");
        const desired = desiredEndTextRef.current;
        if (desired && desired !== TARGET_TEXT) {
          setPhase(desired === FULL_TEXT ? "forward" : "reverse");
        }
        // Fire completion only for non-hover autoplay flow
        if (!startFromIE && typeof onFinished === "function") {
          onFinished();
        }
      }
    };
    timerRef.current = window.setTimeout(tick, REVERSE_START_DELAY_MS);
    return clearTimer;
  }, [phase, startFromIE, onFinished]);

  return (
    <div
      className={
        className ??
        "relative w-full flex items-center justify-start select-none py-20 cursor-pointer"
      }
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
    >
      <div className={textClassName ?? "whitespace-pre text-h1"}>
        {text.endsWith(".") ? (
          <>
            <span>{text.slice(0, -1)}</span>
            <span className="text-quaternary">.</span>
          </>
        ) : (
          text
        )}
      </div>
    </div>
  );
}

