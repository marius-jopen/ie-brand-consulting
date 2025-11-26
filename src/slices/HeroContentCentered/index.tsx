"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import RandomCircles from "@/lib/RandomCircles";
import { StaggerContainer, FadeInUp } from "@/lib/FramerStagger";

/**
 * Props for `HeroContentCentered`.
 */
export type HeroContentCenteredProps =
  SliceComponentProps<Content.HeroContentCenteredSlice>;

/**
 * Component for "HeroContentCentered" Slices.
 */
const HeroContentCentered: FC<HeroContentCenteredProps> = ({ slice }) => {
  const [shouldAlignCircles, setShouldAlignCircles] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleMediaChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    handleMediaChange(mediaQuery);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  useEffect(() => {
    setShouldAlignCircles(inView);
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div
        className={`bg-primary py-16 md:py-20 relative min-h-[70vh] md:min-h-screen md:h-screen transition-all duration-[2100ms] ease-in-out ${
          inView 
            ? "mx-0 rounded-none" 
            : "mx-4 rounded-lg md:mx-11 md:rounded-lg"
        }`}>
        {/* Random white circles with hover animation */}
        <RandomCircles
          count={8}
          minSize={isMobile ? 35 : 80}
          maxSize={isMobile ? 35 : 80}
          color="#ffffff"
          opacity={1}
          transitionMs={1200}
          isHovered={shouldAlignCircles}
        />
        
        <StaggerContainer className="relative z-10 flex items-center justify-center h-full px-6 md:px-0">
          <div
            onMouseEnter={() => setShouldAlignCircles(true)}
            onMouseLeave={() => setShouldAlignCircles(inView)}
            >
            {slice.primary.title && (
              <FadeInUp>
                <div
                  className="text-h3-variable text-center pt-18 relative z-10 mx-auto w-[85vw]">
                  {asText(slice.primary.title)}
                </div>
              </FadeInUp>
            )}
            
            <div className="mx-auto pb-10 md:pb-16 w-[85vw] md:max-w-3xl pt-[50vw] md:pt-16 md:pt-22 relative z-10">
            
              {slice.primary.subtitle && (
                <FadeInUp>
                  <div className="text-h7 text-center pb-8">
                    {asText(slice.primary.subtitle)}
                  </div>
                </FadeInUp>
              )}
              
              {slice.primary.description && (
                <FadeInUp>
                  <div className="text-p1 text-center">
                    {asText(slice.primary.description)}
                  </div>
                </FadeInUp>
              )}
            </div>
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
};

export default HeroContentCentered;
