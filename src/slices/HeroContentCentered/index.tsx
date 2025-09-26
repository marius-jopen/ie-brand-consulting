"use client";

import { FC, useState } from "react";
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

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div 
        className="bg-primary py-20 mx-11 relative rounded-lg"
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
          <div className="text-h2 text-center pt-18 relative z-10">
            {asText(slice.primary.title)}
          </div>
        )}
        
        <div className="container mx-auto pb-20 mx-auto w-3/5 pt-22 relative z-10">
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
