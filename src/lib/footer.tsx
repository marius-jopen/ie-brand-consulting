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
              <h3>Location</h3>
              <p>{location}</p>
            </div>
          )}

          {/* Social Links */}
          {socials && socials.length > 0 && (
            <div>
              <h3>Follow Us</h3>
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
              <h3>About</h3>
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
            <div>
              <p>
                Built with Next.js & Prismic
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
