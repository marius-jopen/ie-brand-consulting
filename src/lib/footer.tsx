"use client";

import { PrismicNextLink } from "@prismicio/next";
import { SettingsDocument } from "../../prismicio-types";
import { useState, useEffect } from "react";

interface FooterProps {
  settings: SettingsDocument;
  isDarkMode?: boolean;
}

export default function Footer({ settings, isDarkMode = false }: FooterProps) {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/New_York"
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!settings?.data) {
    return null;
  }

  const { location, socials, footer_text } = settings.data;

  const footerClasses = isDarkMode
    ? "bg-tertiary text-white"
    : "";

  const textClasses = isDarkMode
    ? "text-p3 pt-8 pb-6 px-4 text-white"
    : "text-p3 pt-8 pb-6 px-4";

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${footerClasses} md:-mt-18`}>
      <div className={textClasses}>
        {/* Mobile / Tablet Layout */}
        <div className="flex justify-between items-center md:hidden">
          <div className="text-xs">
            {currentTime}{" "}
            <span className="text-gray-400">New York, USA</span>
          </div>
          <div className="text-xs">
            ©{currentYear} IE Brand Consulting LLC.
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center flex-nowrap md:mt-8 md:translate-y-[8px]">
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
