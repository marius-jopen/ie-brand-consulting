import { PrismicLink } from "@prismicio/react";
import { SettingsDocument } from "../../prismicio-types";

interface NavigationProps {
  settings: SettingsDocument;
}

export default function Navigation({ settings }: NavigationProps) {
  if (!settings?.data) {
    return null;
  }

  const { items } = settings.data;

  return (
    <>
      {/* Main Navigation */}
      <nav className="flex gap-4">
        {items?.map((item, index) => (
          <div className="flex gap-4" key={index}>
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
