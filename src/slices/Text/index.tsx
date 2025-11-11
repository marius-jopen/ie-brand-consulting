"use client";

import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { StaggerContainer, FadeInUp } from "@/lib/FramerStagger";


/**
 * Props for `Text`.
 */
export type TextProps = SliceComponentProps<Content.TextSlice>;

/**
 * Component for "Text" Slices.
 */
const Text: FC<TextProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {slice.primary.text && (
        <StaggerContainer className="text-box container mx-auto w-1/2 pb-20 text-p1 space-y-6">
          <FadeInUp>
            <PrismicRichText field={slice.primary.text} />
          </FadeInUp>
        </StaggerContainer>
      )}
    </section>
  );
};

export default Text;
