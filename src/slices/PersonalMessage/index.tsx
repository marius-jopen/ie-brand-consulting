import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

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
      <div className="mx-auto w-10/12 pt-20 pb-20 text-box">
        {slice.primary.heading && (
          <div className="text-h4 text-center pb-20">
            {asText(slice.primary.heading)}
          </div>
        )}
        
        {slice.primary.text && (
          <div className="text-p1 columns-3 gap-8">
            <PrismicRichText field={slice.primary.text} />
          </div>
        )}
      </div>
    </section>
  );
};

export default PersonalMessage;
