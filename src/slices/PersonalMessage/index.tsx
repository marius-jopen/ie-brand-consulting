"use client";

import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { StaggerContainer, FadeInUp } from "@/lib/FramerStagger";

/**
 * Props for `PersonalMessage`.
 */
export type PersonalMessageProps =
  SliceComponentProps<Content.PersonalMessageSlice>;

/**
 * Component for "PersonalMessage" Slices.
 */
type AnimatedBlockProps = {
  as: "p" | "li";
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  inView: boolean;
  baseDelaySec: number;
};

const AnimatedBlock: FC<AnimatedBlockProps> = ({ as, children, containerRef, inView, baseDelaySec }) => {
  const elRef = useRef<HTMLElement | null>(null);
  const [delaySec, setDelaySec] = useState<number | null>(null);

  const computeDelay = () => {
    const container = containerRef.current;
    const el = elRef.current;
    if (!container || !el) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    // Detect columns by unique left positions (robust to computed styles)
    const allBlocks = Array.from(container.querySelectorAll<HTMLElement>(".pm-block"));
    if (allBlocks.length === 0) return;

    const lefts = allBlocks.map((node) => Math.round(node.getBoundingClientRect().left - containerRect.left));
    const uniqueLefts: number[] = [];
    const threshold = 6; // px clustering tolerance
    lefts.forEach((l) => {
      const found = uniqueLefts.find((u) => Math.abs(u - l) < threshold);
      if (found == null) uniqueLefts.push(l);
    });
    uniqueLefts.sort((a, b) => a - b);

    const getColIndexFromLeft = (leftValue: number) => {
      let bestIdx = 0;
      let bestDist = Infinity;
      uniqueLefts.forEach((u, i) => {
        const d = Math.abs(u - leftValue);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      });
      return bestIdx;
    };

    const columns: HTMLElement[][] = uniqueLefts.map(() => []);
    allBlocks.forEach((node) => {
      const nodeLeft = Math.round(node.getBoundingClientRect().left - containerRect.left);
      const idx = getColIndexFromLeft(nodeLeft);
      columns[idx].push(node);
    });

    columns.forEach((arr) => arr.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top));

    const myLeft = Math.round(elRect.left - containerRect.left);
    const colIndex = getColIndexFromLeft(myLeft);
    const myColumn = columns[colIndex];
    const itemIndex = Math.max(0, myColumn.findIndex((n) => n === el));

    const COL_STAGGER_SEC = 0.3; // column-to-column delay
    const WITHIN_STAGGER_SEC = 0; // items in a column animate together

    const delay = colIndex * COL_STAGGER_SEC + itemIndex * WITHIN_STAGGER_SEC;
    setDelaySec(delay);
  };

  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => computeDelay());
    const onResize = () => computeDelay();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    type DocumentWithFonts = Document & { fonts?: { ready?: Promise<void> } };
    const docWithFonts = document as DocumentWithFonts;
    const onFontsReady = () => computeDelay();
    docWithFonts.fonts?.ready?.then(() => onFontsReady());
  }, []);

  type MotionUnionProps = HTMLMotionProps<"p"> | HTMLMotionProps<"li">;
  const MotionTag = (as === "p" ? motion.p : motion.li) as React.ComponentType<MotionUnionProps>;

  const readyToAnimate = inView && delaySec != null;

  return (
    <MotionTag
      ref={(node: Element | null) => { elRef.current = (node as HTMLElement) ?? null; }}
      className="pm-block break-inside-avoid will-change-transform"
      initial={{ opacity: 0, y: 16 }}
      animate={readyToAnimate ? { opacity: 1, y: 0 } : {}}
      transition={{
        opacity: { duration: 1, ease: "easeOut", delay: (delaySec ?? 0) + baseDelaySec },
        y: { duration: 1, ease: "easeOut", delay: (delaySec ?? 0) + baseDelaySec },
      }}
    >
      {children}
    </MotionTag>
  );
};

const PersonalMessage: FC<PersonalMessageProps> = ({ slice }) => {
  const columnsRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const container = columnsRef.current;
    if (!container) return;

    let hasTriggered = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered) {
            hasTriggered = true;
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.05 }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StaggerContainer className="mx-auto w-10/12 min-h-screen flex items-center justify-center">
        <div className="pt-24 pb-24 text-box">
            {slice.primary.heading && (
              <FadeInUp>
                <div className="text-h4 text-center pb-20 will-change-transform">
                  {asText(slice.primary.heading)}
                </div>
              </FadeInUp>
            )}

            {slice.primary.text && (
              <div ref={columnsRef} className="text-p1 columns-3 gap-8">
                <PrismicRichText
                  field={slice.primary.text}
                  components={{
                    paragraph: ({ children }) => (
                      <AnimatedBlock as="p" containerRef={columnsRef} inView={inView} baseDelaySec={0.2}>{children}</AnimatedBlock>
                    ),
                    listItem: ({ children }) => (
                      <AnimatedBlock as="li" containerRef={columnsRef} inView={inView} baseDelaySec={0.2}>{children}</AnimatedBlock>
                    ),
                    oListItem: ({ children }) => (
                      <AnimatedBlock as="li" containerRef={columnsRef} inView={inView} baseDelaySec={0.2}>{children}</AnimatedBlock>
                    ),
                  }}
                />
              </div>
            )}
        </div>
      </StaggerContainer>
    </section>
  );
};

export default PersonalMessage;
