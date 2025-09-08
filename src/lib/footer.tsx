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
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Location */}
          {location && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Location</h3>
              <p className="text-gray-300">{location}</p>
            </div>
          )}

          {/* Social Links */}
          {socials && socials.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex flex-col space-y-2">
                {socials.map((social, index) => (
                  <PrismicLink
                    key={index}
                    field={social}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {social.text || "Social Link"}
                  </PrismicLink>
                ))}
              </div>
            </div>
          )}

          {/* Footer Text */}
          {footer_text && (
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <p className="text-gray-300">{footer_text}</p>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} IE Brand Consulting. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400 text-sm">
                Built with Next.js & Prismic
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
