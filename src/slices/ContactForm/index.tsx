"use client";

import { FC, useMemo, useState } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { StaggerContainer, FadeInUp } from "@/lib/FramerStagger";

/**
 * Props for `ContactForm`.
 */
export type ContactFormProps = SliceComponentProps<Content.ContactFormSlice>;

/**
 * Component for "ContactForm" Slices.
 */
const ContactForm: FC<ContactFormProps> = ({ slice }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);

  const isSendDisabled = useMemo(() => {
    return email.trim().length === 0 || message.trim().length === 0;
  }, [email, message]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (isSendDisabled) return;
    // Submission handling can be wired later
  };

  return (
    <section
      className="bg-tertiary text-white min-h-screen flex flex-col items-center justify-center pb-0 pt-24 px-4"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StaggerContainer className="w-full max-w-5xl">
        {slice.primary.title && (
          <FadeInUp>
            <div className="text-h1 font-bold text-center mb-12">
              {asText(slice.primary.title)}
            </div>
          </FadeInUp>
        )}

        <form className="w-full max-w-5xl" onSubmit={handleSubmit}>
          <StaggerContainer>
            {/* Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {/* First Name */}
              <FadeInUp>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-p4">First Name*</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-white text-white placeholder-gray-500 focus:border-white focus:outline-none py-2 text-lg"
                  />
                </div>
              </FadeInUp>

              {/* Last Name */}
              <FadeInUp>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-p4">Last Name*</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-white text-white placeholder-gray-500 focus:border-white focus:outline-none py-2 text-lg"
                  />
                </div>
              </FadeInUp>

              {/* Email (left column under First Name); keep right column empty to drop Message to next row */}
              <FadeInUp>
                <div className="space-y-2 md:col-span-1">
                  <label className="block text-sm font-medium text-p4">Email*</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="youremail@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-white text-white placeholder-gray-500 focus:border-white focus:outline-none py-2 text-lg"
                  />
                </div>
              </FadeInUp>

              {/* Empty placeholder to keep grid alignment like design */}
              <div className="hidden md:block" />

              {/* Message (spans two columns) */}
              <FadeInUp>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-p4">Message</label>
                  <textarea
                    name="message"
                    placeholder="Write here your message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none py-2 text-lg resize-none"
                  />
                </div>
              </FadeInUp>

              {/* Divider line separate full width row */}
              <div className="md:col-span-2 border-b border-white" />

              {/* Agreement + Submit stacked full width */}
              <div className="md:col-span-2">
                <FadeInUp>
                  <div className="w-full flex flex-col gap-8">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="agreement"
                        id="agreement"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-1 w-4 h-4 appearance-none border-1 border-white rounded-full grid place-content-center bg-transparent focus:outline-none focus:ring-0 focus:ring-offset-0 checked:bg-white"
                      />
                      <label htmlFor="agreement" className="text-sm text-p4 leading-relaxed w-2/3">
                        {slice.primary.agreement_text && (
                          <PrismicRichText
                            field={slice.primary.agreement_text}
                            components={{
                              paragraph: ({ children }) => <span>{children}</span>,
                              strong: ({ children }) => <span className="text-white font-medium">{children}</span>,
                              hyperlink: ({ node, children }) => (
                                <PrismicNextLink field={node.data} className="text-gray-400">
                                  {children}
                                </PrismicNextLink>
                              ),
                            }}
                          />
                        )}
                      </label>
                    </div>

                    <div className="flex justify-center pt-8 w-full">
                      <button
                        type="submit"
                        disabled={isSendDisabled}
                        className={`text-h5 font-bold text-white transition-colors duration-200 ${
                          isSendDisabled ? "opacity-50 cursor-not-allowed" : "hover:text-gray-300"
                        }`}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </FadeInUp>
              </div>
            </div>
          </StaggerContainer>
        </form>
      </StaggerContainer>
    </section>
  );
};

export default ContactForm;
