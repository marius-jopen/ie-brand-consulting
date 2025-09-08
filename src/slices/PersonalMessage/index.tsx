import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@prismicio/react";

/**
 * Props for `PersonalMessage`.
 */
export type PersonalMessageProps =
  SliceComponentProps<Content.PersonalMessageSlice>;

/**
 * Component for "PersonalMessage" Slices.
 */
const PersonalMessage: FC<PersonalMessageProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {slice.primary.heading && (
        <PrismicRichText field={slice.primary.heading} />
      )}
      
      {slice.primary.text && (
        <PrismicRichText field={slice.primary.text} />
      )}
    </section>
  );
};

export default PersonalMessage;
