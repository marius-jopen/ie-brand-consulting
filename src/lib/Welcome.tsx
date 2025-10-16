"use client";

import { useState } from "react";
import type { TransitionEvent } from "react";
import Opener from "@/lib/Opener";

export default function Welcome() {
  const [visible, setVisible] = useState(true);
  const [render, setRender] = useState(true);

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
          <Opener onFinished={handleFinished} textClassName="whitespace-pre text-h1 text-white" />
        </div>
      </div>
    </div>
  );
}


