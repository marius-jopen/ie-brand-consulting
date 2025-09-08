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
      <nav>
        {items?.map((item, index) => (
          <div key={index}>
            {item.links?.map((link, linkIndex) => (
              <PrismicLink key={linkIndex} field={link}>
                {link.text || "Link"}
              </PrismicLink>
            ))}
          </div>
        ))}
      </nav>
    </>
  );
}
