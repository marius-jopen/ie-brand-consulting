"use client";

import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import MorphingDots from "@/lib/MorphingDots";

/**
 * Props for `StackedHeadings`.
 */
export type StackedHeadingsProps =
  SliceComponentProps<Content.StackedHeadingsSlice>;

/**
 * Component for "StackedHeadings" Slices.
 */
const StackedHeadings: FC<StackedHeadingsProps> = ({ slice }) => {
  const items = slice.primary.items ?? [];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const showIcons = !!slice.primary.icons;
  const listRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = listRef.current;
    if (!element) return;

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
      { root: null, threshold: 0.15 }
    );

    observer.observe(element);
    return () => observer.disconnect();
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
          <div className="pt-10 pb-20" ref={listRef}>
            {items.map((item, index) => (
              <div
                className={`text-center transition-opacity duration-500 ${showIcons ? (hoveredIndex !== null ? (hoveredIndex === index ? "opacity-100 relative z-10" : "opacity-[3%] relative -z-10") : "opacity-100") : "opacity-100"}`}
                key={index}
                onMouseEnter={showIcons ? () => setHoveredIndex(index) : undefined}
                onMouseLeave={showIcons ? () => setHoveredIndex(null) : undefined}
              >
                {item.title && (
                  <div
                    className={`${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} transition-all duration-700`}
                    style={{ transitionDelay: `${index * 700}ms` }}
                  >
                    {showIcons && item.link ? (
                      <PrismicNextLink field={item.link}>
                        <div className="text-h1 cursor-pointer">{item.title}</div>
                      </PrismicNextLink>
                    ) : (
                      <div className="text-h1">{item.title}</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StackedHeadings;
