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
        <StaggerContainer className="text-center container mx-auto mx-auto md:w-1/2 pb-20 px-8 md:px-0">
          <FadeInUp>{asText(slice.primary.description)}</FadeInUp>
        </StaggerContainer>
      )}
    </section>
  );
};

export default CenteredDescription;
