"use client";

import { motion, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import type { FC, PropsWithChildren } from "react";
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

    // 1) Immediate check on mount / route change
    if (checkVisible()) {
      setShouldShow(true);
    } else {
      setShouldShow(false);
    }

    // 2) IntersectionObserver to promote to visible as soon as it intersects
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

    // 3) Re-check after layout/paint and after fonts load
    const rafId = window.requestAnimationFrame(() => {
      if (checkVisible()) setShouldShow(true);
    });
    const anyDoc: any = document as any;
    let fontsThen: any;
    if (anyDoc?.fonts?.ready?.then) {
      fontsThen = anyDoc.fonts.ready.then(() => {
        if (checkVisible()) setShouldShow(true);
      });
    }

    // 4) Safety timeout in case IO misses due to rapid route transitions
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
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}>;

export const FadeInUp: FC<FadeInUpProps> = ({ as = "div", className, children }) => {
  const MotionTag: any = (motion as any)[as] ?? motion.div;
  return (
    <MotionTag className={className} variants={fadeInUpVariants}>
      {children}
    </MotionTag>
  );
};


