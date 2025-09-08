import { PrismicLink } from "@prismicio/react";
import { SettingsDocument } from "../../prismicio-types";

interface NavigationProps {
  settings: SettingsDocument;
}

export default function Navigation({ settings }: NavigationProps) {
  if (!settings?.data) {
    return null;
  }

  const { items, location } = settings.data;

  return (
    <>
      {/* Main Navigation */}
      <nav className="flex items-baseline space-x-4">
        {items?.map((item, index) => (
          <div key={index} className="flex space-x-4">
            {item.links?.map((link, linkIndex) => (
              <PrismicLink
                key={linkIndex}
                field={link}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.text || "Link"}
              </PrismicLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Location */}
      {location && (
        <div className="hidden lg:block text-sm text-gray-600 ml-4">
          {location}
        </div>
      )}
    </>
  );
}
