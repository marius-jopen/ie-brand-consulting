import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@prismicio/react";

/**
 * Props for `ContactForm`.
 */
export type ContactFormProps = SliceComponentProps<Content.ContactFormSlice>;

/**
 * Component for "ContactForm" Slices.
 */
const ContactForm: FC<ContactFormProps> = ({ slice }) => {
  return (
    <section
      className="bg-tertiary text-white"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {slice.primary.title && (
        <div className="text-h2 text-center">
          {asText(slice.primary.title)}
        </div>
      )}
      
      <form>
        <div>
          <label>Name:</label>
          <input type="text" name="name" />
        </div>
        
        <div>
          <label>Email:</label>
          <input type="email" name="email" />
        </div>
        
        <div>
          <label>Message:</label>
          <textarea name="message"></textarea>
        </div>
        
        <div>
          <input type="checkbox" name="agreement" />
          <label>
            {slice.primary.agreement_text && (
              <PrismicRichText field={slice.primary.agreement_text} />
            )}
          </label>
        </div>
        
        <button type="submit">Sen</button>
      </form>
    </section>
  );
};

export default ContactForm;
