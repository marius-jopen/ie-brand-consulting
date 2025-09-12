import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

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
      <div className="text-center pt-8 pb-12  mx-auto w-4/5">
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
      </div>
    </section>
  );
};

export default HighlightedHeading;
