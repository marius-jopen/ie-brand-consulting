import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@prismicio/react";

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
      {slice.primary.subtitle && (
        <PrismicRichText field={slice.primary.subtitle} />
      )}
      
      {slice.primary.title && (
        <PrismicRichText field={slice.primary.title} />
      )}
    </section>
  );
};

export default HighlightedHeading;
