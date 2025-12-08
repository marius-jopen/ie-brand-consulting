"use client";

import { FC, useMemo, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import MorphingDots from "@/lib/MorphingDots";
import { StaggerContainer, FadeInUp } from "@/lib/FramerStagger";

/**
 * Props for `Headline`.
 */
export type HeadlineProps = SliceComponentProps<Content.HeadlineSlice>;

/**
 * Component for "Headline" Slices.
 */
const Headline: FC<HeadlineProps> = ({ slice }) => {
  const items = useMemo(
    () => slice.primary.items ?? [],
    [slice.primary.items]
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Map titles to icons
  const sources = useMemo(() => {
    const palette = [
      { id: "listen", url: "/svgs/listen.svg" },
      { id: "read", url: "/svgs/read.svg" },
      { id: "watch", url: "/svgs/watch.svg" },
      { id: "speak", url: "/svgs/speak.svg" },
    ];
    const defaultOrder = ["listen", "read", "watch", "speak"];
    return items.map((it, idx) => {
      const fromTitle = (it.title as unknown as string)?.toString().trim().toLowerCase();
      const id = palette.some((p) => p.id === fromTitle) ? fromTitle : defaultOrder[idx % defaultOrder.length];
      const found = palette.find((p) => p.id === id)!;
      return { id: found.id, url: found.url };
    });
  }, [items]);

  const activeId = useMemo(() => (hoveredIndex != null ? (sources[hoveredIndex]?.id || null) : null), [hoveredIndex, sources]);

  return (
    <section
      className="relative flex items-center justify-center min-h-[90vh] pt-20"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {/* Centered morphing dots, always on for this slice */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-[50vw] max-w-[900px] aspect-square">
        <MorphingDots
          sources={sources}
          activeId={activeId}
          width="100%"
          height="100%"
          className="scale-[0.9] translate-y-[10%]"
          dotColor="#E4E1DB"
          dotOpacity={1}
          moveTransitionMs={650}
          fadeTransitionMs={650}
        />
      </div>

      <StaggerContainer className="flex md:gap-4 flex-wrap flex-col md:flex-row mx-12 justify-center ">
        {items.map((item, index) => (
          <FadeInUp key={index}>
            <div
              className={`text-center md:text-left transition-opacity duration-300 ${hoveredIndex !== null ? (hoveredIndex === index ? "opacity-100 relative z-10" : "opacity-[3%] relative -z-10") : "opacity-100"}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {item.title && (
                item.link ? (
                  <PrismicNextLink field={item.link}>
                    <div className="text-headline">{item.title}</div>
                  </PrismicNextLink>
                ) : (
                  <div className="text-headline">{item.title}</div>
                )
              )}
            </div>
          </FadeInUp>
        ))}
      </StaggerContainer>
    </section>
  );
};

export default Headline;
