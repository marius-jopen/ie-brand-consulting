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

  return (
    <footer className={footerClasses}>
      <div className={textClasses}>
        <div className="flex items-center flex-nowrap">
          {/* Location - Left */}
          <div className="flex-1">
            {location && (
              <p>{location}</p>
            )}
          </div>

          {/* Social Links - Center */}
          <div className="flex-1 flex justify-center">
            {socials && socials.length > 0 && (
              <div className="flex gap-4">
                {socials.map((social, index) => (
                  <PrismicNextLink 
                    key={index} 
                    field={social}
                    className={isDarkMode ? "text-white hover:text-gray-300" : ""}
                  >
                    {social.text || "Social Link"}
                  </PrismicNextLink>
                ))}
              </div>
            )}
          </div>

          {/* Footer Text - Right */}
          <div className="flex-1 flex justify-end">
            © {new Date().getFullYear()} IE Brand Consulting. All rights reserved.
            {footer_text && (
              <p>{footer_text}</p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
