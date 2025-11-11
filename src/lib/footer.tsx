import { PrismicNextLink } from "@prismicio/next";
import { SettingsDocument } from "../../prismicio-types";

interface FooterProps {
  settings: SettingsDocument;
  isDarkMode?: boolean;
}

export default function Footer({ settings, isDarkMode = false }: FooterProps) {
  if (!settings?.data) {
    return null;
  }

  const { location, socials, footer_text } = settings.data;

  const footerClasses = isDarkMode
    ? "bg-tertiary text-white"
    : "";

  const textClasses = isDarkMode
    ? "text-p3 pt-16 pb-6 px-4 text-white"
    : "text-p3 pt-16 pb-6 px-4";

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${footerClasses} md:-mt-18`}>
      <div className={textClasses}>
        {/* Mobile / Tablet Layout */}
        <div className="flex flex-col items-center gap-8 md:hidden">
          <div className="w-full flex justify-center">
            {socials && socials.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4">
                {socials.map((social, index) => (
                  <PrismicNextLink
                    key={index}
                    field={social}
                    className={isDarkMode ? "text-white hover:text-gray-300" : "hover:text-gray-600"}
                  >
                    {social.text || "Social Link"}
                  </PrismicNextLink>
                ))}
              </div>
            )}
          </div>

          <div className="w-full text-center space-y-2">
            {location && <p>{location}</p>}
            <div>
              <p>© {currentYear} IE Brand Consulting. All rights reserved.</p>
              {footer_text && <p>{footer_text}</p>}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center flex-nowrap md:mt-8 translate-y-[8px]">
          <div className="flex-1">
            {location && <p>{location}</p>}
          </div>

          <div className="flex-1 flex justify-center">
            {socials && socials.length > 0 && (
              <div className="flex gap-4">
                {socials.map((social, index) => (
                  <PrismicNextLink
                    key={index}
                    field={social}
                    className={isDarkMode ? "text-white hover:text-gray-300" : "hover:text-gray-600"}
                  >
                    {social.text || "Social Link"}
                  </PrismicNextLink>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 flex justify-end text-right">
            <div>
              <p>© {currentYear} IE Brand Consulting. All rights reserved.</p>
              {footer_text && <p>{footer_text}</p>}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
