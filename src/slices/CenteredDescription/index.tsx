import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@prismicio/react";

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
        <PrismicRichText field={slice.primary.description} />
      )}
    </section>
  );
};

export default CenteredDescription;
