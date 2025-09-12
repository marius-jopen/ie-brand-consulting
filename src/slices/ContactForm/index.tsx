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
      className="bg-tertiary text-white min-h-screen flex flex-col items-center justify-center py-16 px-4"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {slice.primary.title && (
        <div className="text-h1 font-bold text-center mb-16">
          {asText(slice.primary.title)}
        </div>
      )}
      
      <form className="w-full max-w-2xl space-y-8">
        {/* First Name and Last Name Row */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              First Name*
            </label>
            <input 
              type="text" 
              name="firstName" 
              placeholder="John"
              className="w-full bg-transparent border-0 border-b border-white text-white placeholder-gray-500 focus:border-white focus:outline-none py-2 text-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Last Name*
            </label>
            <input 
              type="text" 
              name="lastName" 
              placeholder="Doe"
              className="w-full bg-transparent border-0 border-b border-white text-white placeholder-gray-500 focus:border-white focus:outline-none py-2 text-lg"
            />
          </div>
        </div>
        
        {/* Email Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Email*
          </label>
          <input 
            type="email" 
            name="email" 
            placeholder="youremail@gmail.com"
            className="w-full bg-transparent border-0 border-b border-white text-white placeholder-gray-500 focus:border-white focus:outline-none py-2 text-lg"
          />
        </div>
        
        {/* Message Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Message
          </label>
          <textarea 
            name="message" 
            placeholder="Write here your message"
            rows={4}
            className="w-full bg-transparent border-0 border-b border-white text-white placeholder-gray-500 focus:border-white focus:outline-none py-2 text-lg resize-none"
          />
        </div>
        
        {/* Privacy Policy Checkbox */}
        <div className="flex items-start space-x-3">
          <input 
            type="checkbox" 
            name="agreement" 
            id="agreement"
            className="mt-1 w-4 h-4 text-white bg-transparent border border-white rounded focus:ring-0 focus:ring-offset-0"
          />
          <label htmlFor="agreement" className="text-sm text-gray-300 leading-relaxed">
            {slice.primary.agreement_text && (
              <PrismicRichText 
                field={slice.primary.agreement_text}
                components={{
                  paragraph: ({ children }) => <span>{children}</span>,
                  strong: ({ children }) => <span className="text-white font-medium">{children}</span>,
                }}
              />
            )}
          </label>
        </div>
        
        {/* Send Button */}
        <div className="flex justify-center pt-8">
          <button 
            type="submit" 
            className="text-h4 font-bold text-white hover:text-gray-300 transition-colors duration-200"
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
};

export default ContactForm;
