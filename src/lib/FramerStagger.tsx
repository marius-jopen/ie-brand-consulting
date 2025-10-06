"use client";

import { motion, type Variants, type MotionProps } from "framer-motion";
import { usePathname } from "next/navigation";
import type { FC, PropsWithChildren, ComponentType } from "react";
import { useEffect, useRef, useState } from "react";

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

type StaggerContainerProps = PropsWithChildren<{
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
  viewportAmount?: number;
  viewportOnce?: boolean;
  retriggerOnPathname?: boolean;
}>;

export const StaggerContainer: FC<StaggerContainerProps> = ({
  children,
  className,
  delayChildren = 0.1,
  staggerChildren = 0.12,
  viewportAmount = 0.05,
  viewportOnce = false,
  retriggerOnPathname = true,
}) => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const vh = window.innerHeight || document.documentElement.clientHeight;
    const checkVisible = () => {
      const rect = el.getBoundingClientRect();
      return rect.top < vh * (1 - viewportAmount) && rect.bottom > 0;
    };

    if (checkVisible()) {
      setShouldShow(true);
    } else {
      setShouldShow(false);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldShow(true);
            observer.disconnect();
          }
        });
      },
      { root: null, rootMargin: "0px 0px -5% 0px", threshold: 0 }
    );
    observer.observe(el);

    const rafId = window.requestAnimationFrame(() => {
      if (checkVisible()) setShouldShow(true);
    });

    type DocumentWithFonts = Document & { fonts?: { ready?: Promise<void> } };
    const docWithFonts = document as DocumentWithFonts;
    const fontsReady: Promise<void> | undefined = docWithFonts.fonts?.ready;
    if (fontsReady) {
      fontsReady.then(() => {
        if (checkVisible()) setShouldShow(true);
      });
    }

    const timeoutId = window.setTimeout(() => {
      if (checkVisible()) setShouldShow(true);
    }, 120);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, [pathname, viewportAmount]);
  return (
    <motion.div
      ref={containerRef}
      key={retriggerOnPathname ? pathname : undefined}
      className={className}
      initial={shouldShow ? "show" : "hidden"}
      animate={shouldShow ? "show" : undefined}
      whileInView="show"
      viewport={{ once: viewportOnce, amount: viewportAmount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren, delayChildren } },
      }}
    >
      {children}
    </motion.div>
  );
};

type FadeInUpProps = PropsWithChildren<{
  as?: "div" | "p" | "li";
  className?: string;
}>;

export const FadeInUp: FC<FadeInUpProps> = ({ as = "div", className, children }) => {
  const tagMap: Record<"div" | "p" | "li", ComponentType<MotionProps>> = {
    div: motion.div,
    p: motion.p,
    li: motion.li,
  };
  const MotionTag = tagMap[as] ?? motion.div;
  return (
    <MotionTag className={className} variants={fadeInUpVariants}>
      {children}
    </MotionTag>
  );
};


