"use client";

import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { StaggerContainer, FadeInUp } from "@/lib/FramerStagger";

/**
 * Props for `HighlightedHeading`.
 */
export type HighlightedHeadingProps =
  SliceComponentProps<Content.HighlightedHeadingSlice>;

/**
 * Component for "HighlightedHeading" Slices.
 */
const HighlightedHeading: FC<HighlightedHeadingProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StaggerContainer className="text-center pt-8 pb-16  mx-auto w-2/3 pt-30">
      <FadeInUp>
        {slice.primary.subtitle && (   
          <h4 className="text-h4 text-secondary">
            {asText(slice.primary.subtitle)}
          </h4>     
        )}
        
        {slice.primary.title && (
          <h4 className="text-h4">
            {asText(slice.primary.title)}
          </h4>
        )}
        </FadeInUp>
      </StaggerContainer>
    </section>
  );
};

export default HighlightedHeading;
