"use client";

import { FC, useMemo, useState, useEffect } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import MorphingDots from "@/lib/MorphingDots";
import { StaggerContainer, FadeInUp } from "@/lib/FramerStagger";

/**
 * Props for `StackedHeadings`.
 */
export type StackedHeadingsProps =
  SliceComponentProps<Content.StackedHeadingsSlice>;

/**
 * Component for "StackedHeadings" Slices.
 */
const StackedHeadings: FC<StackedHeadingsProps> = ({ slice }) => {
  const items = useMemo(
    () => slice.primary.items ?? [],
    [slice.primary.items]
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(true);
  const showIcons = !!slice.primary.icons;
  // In-view animation handled by StaggerContainer

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Map item.icon or fallback by index to local SVGs
  const sources = useMemo(() => {
    const palette = [
      { id: "strategy", url: "/svgs/circle-1.svg" },
      { id: "design", url: "/svgs/circle-2.svg" },
      { id: "marketing", url: "/svgs/circle-3.svg" },
    ];
    const defaultIndexToId = ["design", "strategy", "marketing"]; // 0->design, 1->strategy, 2->marketing
    return items.map((it, idx) => {
      const raw = (it.icon as unknown as string) || "";
      const keyFromIcon = raw.trim().toLowerCase();
      const fallbackId = defaultIndexToId[idx % defaultIndexToId.length];
      const id = palette.some((p) => p.id === keyFromIcon) ? keyFromIcon : fallbackId;
      const found = palette.find((p) => p.id === id)!;
      return { id: found.id, url: found.url };
    });
  }, [items]);

  const activeId = useMemo(() => (hoveredIndex != null ? (sources[hoveredIndex]?.id || null) : null), [hoveredIndex, sources]);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className={`relative flex items-center justify-center pt-10 ${slice.primary.icons ? 'min-h-[90vh]' : ' pt-20 pb-20'}`}>
        {/* Centered overlay displaying morphing dots */}
        {slice.primary.icons && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-[50vw] max-w-[900px] aspect-square">
            <MorphingDots
              sources={sources}
              activeId={activeId}
              width="100%"
              height="100%"
              dotColor="#E4E1DB"
              dotOpacity={1}
              moveTransitionMs={650}
              fadeTransitionMs={650}
            />
          </div>
        )}

        {items && items.length > 0 && (
          <StaggerContainer className="pt-10 pb-20 overflow-visible" delayChildren={0} staggerChildren={0.5}>
            {items.map((item, index) => (
              <FadeInUp key={index}>
                <div
                  className={`text-center transition-opacity duration-500 overflow-visible pb-4 md:pb-0 ${showIcons && !isMobile ? (hoveredIndex !== null ? (hoveredIndex === index ? "opacity-100 relative z-10" : "opacity-[3%] relative -z-10") : "opacity-100") : "opacity-100"}`}
                  onMouseEnter={showIcons && !isMobile ? () => setHoveredIndex(index) : undefined}
                  onMouseLeave={showIcons && !isMobile ? () => setHoveredIndex(null) : undefined}
                >
                  {item.title && (
                    <div className="overflow-visible">
                      {showIcons && item.link ? (
                        <PrismicNextLink field={item.link}>
                          <div className={`text-headline cursor-pointer overflow-visible ${index === items.length - 1 ? 'pb-2 md:pb-0' : ''}`}>{item.title}</div>
                        </PrismicNextLink>
                      ) : (
                        <div className={`text-headline overflow-visible ${index === items.length - 1 ? 'pb-2 md:pb-0' : ''}`}>{item.title}</div>
                      )}
                    </div>
                  )}
                </div>
              </FadeInUp>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
};

export default StackedHeadings;
