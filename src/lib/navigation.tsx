"use client";

import { PrismicNextLink } from "@prismicio/next";
import { SettingsDocument } from "../../prismicio-types";
import { useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import * as prismic from "@prismicio/client";

interface NavigationProps {
  settings: SettingsDocument;
  isDarkMode?: boolean;
}

export default function Navigation({ settings, isDarkMode = false }: NavigationProps) {
  const pathname = usePathname();

  // Check if current page matches any of the links in an item
  const isCurrentPage = useCallback((itemLinks: prismic.LinkField[]) => {
    if (!itemLinks || itemLinks.length === 0) return false;
    
    return itemLinks.some(link => {
      if (link.link_type === 'Document' && link.uid) {
        return pathname === `/${link.uid}` || pathname === link.uid;
      }
      if ('url' in link && link.url) {
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
  }, [pathname]);

  // Memoize current page states to prevent unnecessary re-renders
  const currentPageStates = useMemo(() => {
    if (!settings?.data?.items) return [];
    return settings.data.items.map(item => ({
      hasMultipleLinks: item.links && item.links.length > 1,
      isCurrent: isCurrentPage(item.links || []),
    }));
  }, [settings?.data?.items, isCurrentPage]);

  // Early return if no settings data
  if (!settings?.data) {
    return null;
  }

  const { items } = settings.data;

  return (
    <>
      {/* Main Navigation */}
      <nav className="flex flex-col">
        {/* Main navigation items */}
        <div className="flex gap-4">
          {items?.map((item, index) => {
            return (
              <div 
                className="relative group" 
                key={index}
              >
                {/* First link - always visible */}
                {item.links && item.links[0] && (
                  <PrismicNextLink 
                    field={item.links[0]}
                    className={`block px-3 py-2 text-p3 font-medium transition-colors ${
                      isDarkMode 
                        ? 'text-white hover:text-gray-300' 
                        : 'hover:text-secondary'
                    }`}
                  >
                    {item.links[0].text || "Link"}
                  </PrismicNextLink>
                )}
              </div>
            );
          })}
        </div>

        {/* Sub-navigation row - only show when on current page with multiple links */}
        <div className="relative h-12 flex items-start justify-center">
          {items?.map((item, index) => {
            const { hasMultipleLinks, isCurrent } = currentPageStates[index] || { hasMultipleLinks: false, isCurrent: false };
            const showSubNav = isCurrent && hasMultipleLinks;

            // Only render if has multiple links and is current page
            if (!showSubNav) return null;

            return (
              <div 
                key={`subnav-${index}`}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 flex justify-center gap-8 pt-2 px-4 py-2"
              >
                <div className="flex justify-center gap-4">
                {item.links?.slice(1).map((link, linkIndex) => {
                  const isCurrentLink = isCurrentPage([link]);
                  
                  return (
                    <PrismicNextLink 
                      key={linkIndex} 
                      field={link}
                      className={`inline-block text-p3 transition-colors px-3 py-1 ${
                        isCurrentLink
                          ? isDarkMode 
                            ? 'text-white underline font-medium' 
                            : 'text-black underline font-medium'
                          : isDarkMode
                            ? 'text-white hover:text-white/80'
                            : 'text-secondary hover:text-black'
                      }`}
                    >
                      {link.text || "Link"}
                    </PrismicNextLink>
                  );
                })}
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}
