"use client";

import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { StaggerContainer, FadeInUp } from "@/lib/FramerStagger";

/**
 * Props for `CenteredDescription`.
 */
export type CenteredDescriptionProps =
  SliceComponentProps<Content.CenteredDescriptionSlice>;

/**
 * Component for "CenteredDescription" Slices.
 */
const CenteredDescription: FC<CenteredDescriptionProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {slice.primary.description && (
        <StaggerContainer className="text-center container mx-auto mx-auto w-3/5 pb-16">
          <FadeInUp>{asText(slice.primary.description)}</FadeInUp>
        </StaggerContainer>
      )}
    </section>
  );
};

export default CenteredDescription;
