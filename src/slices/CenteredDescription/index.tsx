import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

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
        <div className="text-center container mx-auto mx-auto w-3/5 pb-16">
          {asText(slice.primary.description)}
        </div>
      )}
    </section>
  );
};

export default CenteredDescription;
