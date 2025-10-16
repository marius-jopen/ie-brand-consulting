"use client";

import { useState, useEffect } from "react";
import type { TransitionEvent } from "react";
import Opener from "@/lib/Opener";

export default function Welcome() {
  const [visible, setVisible] = useState(true);
  const [render, setRender] = useState(true);

  // Adjust these to control when page animations start relative to the overlay fade-out.
  // Must match the CSS transition duration on the overlay (duration-[2000ms]).
  const WELCOME_FADE_OUT_MS = 2000;
  const WELCOME_EARLY_START_MS = 2000; // start page animations this many ms BEFORE overlay fade ends

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("welcome-active");
    return () => {
      root.classList.remove("welcome-active");
    };
  }, []);

  useEffect(() => {
    // When the overlay begins fading out, schedule early release so page animations can start
    if (!visible) {
      const releaseAfterMs = Math.max(0, WELCOME_FADE_OUT_MS - WELCOME_EARLY_START_MS);
      const id = window.setTimeout(() => {
        document.documentElement.classList.remove("welcome-active");
      }, releaseAfterMs);
      return () => window.clearTimeout(id);
    }
  }, [visible]);

  useEffect(() => {
    if (!render) {
      document.documentElement.classList.remove("welcome-active");
    }
  }, [render]);

  const handleFinished = () => {
    window.setTimeout(() => {
      setVisible(false);
    }, 1000);
  };

  const handleTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (!visible && e.propertyName === "opacity") {
      setRender(false);
    }
  };

  if (!render) return null;

  return (
    <div
      className={
        "fixed inset-0 z-[9999] bg-tertiary transition-opacity duration-[2000ms] " +
        (visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
      }
      onTransitionEnd={handleTransitionEnd}
      aria-hidden
    >
      <div className="w-full h-full flex items-center justify-start px-6">
        <div className="px-24">
          <Opener onFinished={handleFinished} textClassName="whitespace-pre text-opener text-white" />
        </div>
      </div>
    </div>
  );
}


