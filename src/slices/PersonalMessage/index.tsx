"use client";

import {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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

  const computeDelay = useCallback(() => {
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
  }, [containerRef]);

  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => computeDelay());
    const onResize = () => computeDelay();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [computeDelay]);

  useEffect(() => {
    type DocumentWithFonts = Document & { fonts?: { ready?: Promise<void> } };
    const docWithFonts = document as DocumentWithFonts;
    const onFontsReady = () => computeDelay();
    docWithFonts.fonts?.ready?.then(() => onFontsReady());
  }, [computeDelay]);

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
      <StaggerContainer className="px-4 w-full md:w-10/12 md:min-h-screen mx-auto flex items-center justify-center">
        <div className="pt-24 pb-10 md:pb-24 text-box relative">
            {slice.primary.heading && (
              <FadeInUp>
                <div className="text-h4 text-center pb-8 md:pb-20 will-change-transform px-8 md:px-0">
                  {asText(slice.primary.heading)}
                </div>
              </FadeInUp>
            )}

            {slice.primary.text && (
              <div
                ref={columnsRef}
                className="text-p1 space-y-6 md:space-y-0 md:columns-3 md:gap-8"
              >
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

            <div className="flex justify-center mt-0 md:mt-0 md:justify-end">
              <div className="md:w-[calc(33.333%-2.666rem)] md:flex md:justify-center">
                <div className="w-16 md:w-full flex justify-center flex-row lg:w-24">
                  <motion.svg
                    viewBox="-15 -15 313.3 300.64"
                    className="w-[15vw] md:w-[5vw] h-auto"
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                  >
                    <motion.path
                      d="M2.27,53.75c-3.44,147.33,4.14,228.41,33.85,213.68,25.36-12.58,43.88-67.53,43.88-229.8,0,120.31-6.1,209.24,22.78,193.88s34.78-74.12,34.78-126.73c0,39.36,1.79,117.29,28.28,92.45,23.74-22.26,26.81-86.33,24.38-115.5-2.43-29.16-16.34-13.65-18.77,3.36-2.43,17.01,1.76,25.02,13.1,21.78,11.34-3.24,30.78-19.11,40.5-40.98-12.15,28.35-13.38,65.71-10.14,81.1,8.78,41.68,64.25-8.43,66.85-104.59,1.62-59.95-30.03-43.13-39.95-18.05"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={{
                        hidden: { pathLength: 0, opacity: 0 },
                        visible: { pathLength: 1, opacity: 1 }
                      }}
                      transition={{
                        pathLength: { duration: 2, ease: "easeInOut", delay: 1.8 },
                        opacity: { duration: 0.3, ease: "easeOut", delay: 1.8 }
                      }}
                    />
                    <motion.path
                      d="M44.39,121.9l66.43-35.65"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={{
                        hidden: { pathLength: 0, opacity: 0 },
                        visible: { pathLength: 1, opacity: 1 }
                      }}
                      transition={{
                        pathLength: { duration: 0.5, ease: "easeInOut", delay: 3.8 },
                        opacity: { duration: 0.3, ease: "easeOut", delay: 3.8 }
                      }}
                    />
                  </motion.svg>
                </div>
              </div>
            </div>
        </div>
      </StaggerContainer>
    </section>
  );
};

export default PersonalMessage;
