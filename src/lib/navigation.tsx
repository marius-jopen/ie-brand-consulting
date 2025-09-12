"use client";

import { PrismicLink } from "@prismicio/react";
import { SettingsDocument } from "../../prismicio-types";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface NavigationProps {
  settings: SettingsDocument;
  isDarkMode?: boolean;
}

export default function Navigation({ settings, isDarkMode = false }: NavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [focusedItem, setFocusedItem] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!settings?.data) {
    return null;
  }

  const { items } = settings.data;

  // Check if current page matches any of the links in an item
  const isCurrentPage = (itemLinks: any[]) => {
    if (!isClient || !itemLinks || itemLinks.length === 0) return false;
    
    return itemLinks.some(link => {
      if (link.link_type === 'Document' && link.uid) {
        return pathname === `/${link.uid}` || pathname === link.uid;
      }
      if (link.url) {
        // Handle both relative and absolute URLs
        try {
          const linkUrl = link.url.startsWith('/') ? link.url : new URL(link.url).pathname;
          return pathname === linkUrl;
        } catch {
          // If URL parsing fails, do a simple string comparison
          return pathname === link.url;
        }
      }
      return false;
    });
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className="flex flex-col">
        {/* Main navigation items */}
        <div className="flex gap-4">
          {items?.map((item, index) => {
            const hasMultipleLinks = item.links && item.links.length > 1;
            const isCurrent = isCurrentPage(item.links || []);
            const showSubNav = isClient && (hoveredItem === index || focusedItem === index || (isCurrent && hasMultipleLinks));

            return (
              <div 
                className="relative group" 
                key={index}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                onFocus={() => setFocusedItem(index)}
                onBlur={() => setFocusedItem(null)}
              >
                {/* First link - always visible */}
                {item.links && item.links[0] && (
                  <PrismicLink 
                    field={item.links[0]}
                    className={`block px-3 py-2 text-p3 font-medium transition-colors ${
                      isDarkMode 
                        ? 'text-white hover:text-gray-300' 
                        : 'hover:text-secondary'
                    }`}
                  >
                    {item.links[0].text || "Link"}
                  </PrismicLink>
                )}
              </div>
            );
          })}
        </div>

        {/* Sub-navigation row - reserve consistent space to prevent layout shifts */}
        <div className="relative h-12 flex items-start justify-center">
          {items?.map((item, index) => {
            const hasMultipleLinks = item.links && item.links.length > 1;
            const isCurrent = isCurrentPage(item.links || []);
            const showSubNav = isClient && (hoveredItem === index || focusedItem === index || (isCurrent && hasMultipleLinks));

            if (!hasMultipleLinks || !showSubNav) return null;

            return (
              <div 
                key={`subnav-${index}`}
                className={`absolute top-0 left-1/2 transform -translate-x-1/2 flex justify-center gap-8 pt-2 px-4 py-2 transition-all duration-200 ease-in-out ${
                  isDarkMode ? 'bg-tertiary' : 'bg-white'
                } ${
                  hoveredItem === index ? 'z-20' : 'z-10'
                }`}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.links?.slice(1).map((link, linkIndex) => {
                  const isCurrentLink = isCurrentPage([link]);
                  
                  return (
                    <PrismicLink 
                      key={linkIndex} 
                      field={link}
                      className={`text-p3 transition-colors ${
                        isCurrentLink
                          ? isDarkMode 
                            ? 'text-white underline font-medium' 
                            : 'text-black underline font-medium'
                          : isDarkMode
                            ? 'text-white hover:text-white'
                            : 'text-secondary hover:text-black'
                      }`}
                    >
                      {link.text || "Link"}
                    </PrismicLink>
                  );
                })}
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}
