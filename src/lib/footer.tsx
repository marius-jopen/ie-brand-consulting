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
      <div>
        <div>
          {/* Location */}
          {location && (
            <div>
              <p>{location}</p>
            </div>
          )}

          {/* Social Links */}
          {socials && socials.length > 0 && (
            <div>
              <div>
                {socials.map((social, index) => (
                  <PrismicLink key={index} field={social}>
                    {social.text || "Social Link"}
                  </PrismicLink>
                ))}
              </div>
            </div>
          )}

          {/* Footer Text */}
          {footer_text && (
            <div>
              <p>{footer_text}</p>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div>
          <div>
            <p>
              © {new Date().getFullYear()} IE Brand Consulting. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
