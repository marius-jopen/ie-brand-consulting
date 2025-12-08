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
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSendDisabled = useMemo(() => {
    return email.trim().length === 0 || message.trim().length === 0;
  }, [email, message]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isSendDisabled || status === "submitting") return;

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          message,
          agreement: agreed ? "yes" : "no",
          name: `${firstName} ${lastName}`.trim(),
          replyTo: email,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(
          errorBody?.message ?? "We couldn't send your message right now."
        );
      }

      setStatus("success");
      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
      setAgreed(false);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't send your message right now."
      );
    }
  };

  return (
    <section
      className="bg-tertiary text-white min-h-screen flex flex-col items-center pb-0 pt-24 md:pt-20 px-4"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {slice.primary.title && (
        <StaggerContainer className="w-full">
          <FadeInUp>
            <div className="text-split font-bold text-center mb-12 md:mb-4">
              {asText(slice.primary.title)}
            </div>
          </FadeInUp>
        </StaggerContainer>
      )}

      {status === "success" ? (
        <StaggerContainer className="w-full max-w-3xl mx-auto">
          <FadeInUp>
            <div className="text-center pb-16 pt-12 md:pt-8 md:pb-24">
              <p className="text-h6 text-white mb-8">
                Thank you! <br /> Your message has been sent.
              </p>
              <p className="text-p3 text-gray-300">
                We&apos;ll get back to you as soon as possible.
              </p>
            </div>
          </FadeInUp>
        </StaggerContainer>
      ) : (
        <StaggerContainer className="w-full max-w-3xl mx-auto">
          <form className="w-full" onSubmit={handleSubmit}>
          <StaggerContainer>
            {/* Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {/* First Name */}
              <FadeInUp>
                <div className="space-y-1">
                  <label className="block text-white">First Name*</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-white text-white placeholder-gray-500 focus:border-white focus:outline-none py-2"
                  />
                </div>
              </FadeInUp>

              {/* Last Name */}
              <FadeInUp>
                <div className="space-y-1">
                  <label className="block text-white">Last Name*</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-white text-white placeholder-gray-500 focus:border-white focus:outline-none py-2"
                  />
                </div>
              </FadeInUp>

              {/* Email (left column under First Name); keep right column empty to drop Message to next row */}
              <FadeInUp>
                <div className="space-y-1 md:col-span-1">
                  <label className="block text-white">Email*</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="youremail@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-white text-white placeholder-gray-500 focus:border-white focus:outline-none py-2"
                  />
                </div>
              </FadeInUp>

              {/* Empty placeholder to keep grid alignment like design */}
              <div className="hidden md:block" />

              {/* Message (spans two columns) */}
              <FadeInUp>
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-white">Message</label>
                  <textarea
                    name="message"
                    placeholder="Write here your message"
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none py-2 resize-none"
                  />
                </div>
              </FadeInUp>


              {/* Agreement + Submit stacked full width */}
              <div className="md:col-span-2">

              {/* Divider line separate full width row */}
              <div className="md:col-span-2 border-b border-white mb-8" />
              
                <FadeInUp>
                  <div className="w-full flex flex-col gap-8">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="agreement"
                        id="agreement"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-1 w-4 h-4 shrink-0 appearance-none border-1 border-white rounded-full grid place-content-center bg-transparent focus:outline-none focus:ring-0 focus:ring-offset-0 checked:bg-white"
                      />
                      <label
                        htmlFor="agreement"
                        className="text-sm text-p4 leading-relaxed w-full md:w-2/3"
                      >
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

                    <div className="flex justify-center pt-8 md:pt-0 w-full">
                      <button
                        type="submit"
                        disabled={isSendDisabled || status === "submitting"}
                        className={`text-h5 font-bold text-white transition-colors duration-200 ${
                          isSendDisabled || status === "submitting"
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:text-gray-300"
                        }`}
                      >
                        {status === "submitting" ? "Sending..." : "Send"}
                      </button>
                    </div>
                    {status === "error" && (
                      <div className="min-h-[1.5rem] text-center pt-4" aria-live="polite">
                        <p className="text-p3 text-red-300">
                          {errorMessage ??
                            "Something went wrong. Please try again in a moment."}
                        </p>
                      </div>
                    )}
                  </div>
                </FadeInUp>
              </div>
            </div>
          </StaggerContainer>
        </form>
      </StaggerContainer>
      )}
    </section>
  );
};

export default ContactForm;
