import { PrismicLink } from "@prismicio/react";
import { SettingsDocument } from "../../prismicio-types";

interface FooterProps {
  settings: SettingsDocument;
}

export default function Footer({ settings }: FooterProps) {
  if (!settings?.data) {
    return null;
  }

  const { location, socials, footer_text } = settings.data;

  return (
    <footer>
      <div className="text-p3 pt-16 pb-6 px-4">
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
                  <PrismicLink key={index} field={social}>
                    {social.text || "Social Link"}
                  </PrismicLink>
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
