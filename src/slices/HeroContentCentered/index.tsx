"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import RandomCircles from "@/lib/RandomCircles";

/**
 * Props for `HeroContentCentered`.
 */
export type HeroContentCenteredProps =
  SliceComponentProps<Content.HeroContentCenteredSlice>;

/**
 * Component for "HeroContentCentered" Slices.
 */
const HeroContentCentered: FC<HeroContentCenteredProps> = ({ slice }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInView(entry.isIntersecting);
      },
      {
        threshold: 0.6,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div 
        className={`bg-primary py-20 relative transition-all duration-[2100ms] ease-in-out ${inView ? "mx-0 rounded-none" : "mx-11 rounded-lg"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Random white circles with hover animation */}
        <RandomCircles
          count={8}
          minSize={80}
          maxSize={80}
          color="#ffffff"
          opacity={1}
          transitionMs={1200}
          isHovered={isHovered}
        />
        
        {slice.primary.title && (
          <div className="text-h2 text-center pt-18 relative z-10 mx-auto max-w-5xl">
            {asText(slice.primary.title)}
          </div>
        )}
        
        <div className="mx-auto pb-20 w-full max-w-3xl pt-22 relative z-10">
          {slice.primary.subtitle && (
            <div className="text-h7 text-center pb-8">
              {asText(slice.primary.subtitle)}
            </div>
          )}
          
          {slice.primary.description && (
            <div className="text-p1 text-center">
              {asText(slice.primary.description)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroContentCentered;
