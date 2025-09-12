"use client";

import { PrismicLink } from "@prismicio/react";
import { SettingsDocument } from "../../prismicio-types";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface NavigationProps {
  settings: SettingsDocument;
}

export default function Navigation({ settings }: NavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [focusedItem, setFocusedItem] = useState<number | null>(null);
  const pathname = usePathname();

  if (!settings?.data) {
    return null;
  }

  const { items } = settings.data;

  // Check if current page matches any of the links in an item
  const isCurrentPage = (itemLinks: any[]) => {
    if (!itemLinks || itemLinks.length === 0) return false;
    
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
            const showSubNav = hoveredItem === index || focusedItem === index || (isCurrent && hasMultipleLinks);

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
                    className="block px-3 py-2 text-p3 font-medium transition-colors hover:text-secondary"
                  >
                    {item.links[0].text || "Link"}
                  </PrismicLink>
                )}
              </div>
            );
          })}
        </div>

        {/* Sub-navigation row - appears below main nav when hovering or on current page */}
        <div className="relative">
          {items?.map((item, index) => {
            const hasMultipleLinks = item.links && item.links.length > 1;
            const isCurrent = isCurrentPage(item.links || []);
            const showSubNav = hoveredItem === index || focusedItem === index || (isCurrent && hasMultipleLinks);

            if (!hasMultipleLinks || !showSubNav) return null;

            return (
              <div 
                key={`subnav-${index}`}
                className={`absolute top-0 left-1/2 transform -translate-x-1/2 flex justify-center gap-8 pt-2 px-4 py-2 bg-white transition-all duration-200 ease-in-out ${
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
                          ? 'text-black underline font-medium' 
                          : 'text-secondary hover:text-tertiary'
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
