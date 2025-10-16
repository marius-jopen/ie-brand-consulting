"use client";

import { motion, type Variants, type MotionProps } from "framer-motion";
import { usePathname } from "next/navigation";
import type { FC, PropsWithChildren, ComponentType, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.6, ease: "easeOut" },
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
  staggerChildren = 0.24,
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
    const isWelcomeActive = () =>
      document.documentElement.classList.contains("welcome-active");
    const canTrigger = () => {
      const rect = el.getBoundingClientRect();
      return rect.top < vh * (1 - viewportAmount) && rect.bottom > 0 && !isWelcomeActive();
    };

    if (canTrigger()) {
      setShouldShow(true);
    } else {
      setShouldShow(false);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isWelcomeActive()) {
              setShouldShow(true);
              observer.disconnect();
            }
          }
        });
      },
      { root: null, rootMargin: "0px 0px -4% 0px", threshold: 0 }
    );
    observer.observe(el);

    const rootEl = document.documentElement;
    const classObserver = new MutationObserver(() => {
      if (!isWelcomeActive() && canTrigger()) {
        setShouldShow(true);
        classObserver.disconnect();
      }
    });
    classObserver.observe(rootEl, { attributes: true, attributeFilter: ["class"] });

    const rafId = window.requestAnimationFrame(() => {
      if (canTrigger()) setShouldShow(true);
    });

    type DocumentWithFonts = Document & { fonts?: { ready?: Promise<void> } };
    const docWithFonts = document as DocumentWithFonts;
    const fontsReady: Promise<void> | undefined = docWithFonts.fonts?.ready;
    if (fontsReady) {
      fontsReady.then(() => {
        if (canTrigger()) setShouldShow(true);
      });
    }

    const timeoutId = window.setTimeout(() => {
      if (canTrigger()) setShouldShow(true);
    }, 120);

    return () => {
      observer.disconnect();
      classObserver.disconnect();
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, [pathname, viewportAmount]);
  return (
    <motion.div
      ref={containerRef}
      key={retriggerOnPathname ? pathname : undefined}
      className={className}
      initial="hidden"
      animate={shouldShow ? "show" : undefined}
      whileInView={shouldShow ? "show" : undefined}
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
  delay?: number;
}>;

export const FadeInUp: FC<FadeInUpProps> = ({ as = "div", className, children, delay }) => {
  type MotionTagProps = MotionProps & { className?: string; children?: ReactNode };
  const tagMap: Record<"div" | "p" | "li", ComponentType<MotionTagProps>> = {
    div: motion.div,
    p: motion.p,
    li: motion.li,
  };
  const MotionTag = tagMap[as] ?? motion.div;
  return (
    <MotionTag className={className} variants={fadeInUpVariants} transition={delay !== undefined ? { delay } : undefined}>
      {children}
    </MotionTag>
  );
};


