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
  
  // Debug logging - logs on both server and client to avoid hydration issues
  if (pathname === '/') {
    console.log('Navigation Debug - pathname is /', {
      items: settings?.data?.items?.map((item, idx) => ({
        index: idx,
        firstLink: item.links?.[0] ? {
          link_type: item.links[0].link_type,
          uid: item.links[0].uid,
          url: 'url' in item.links[0] ? item.links[0].url : undefined,
          text: item.links[0].text,
          id: item.links[0].id,
        } : null
      }))
    });
  }

  // Check if current page matches any of the links in an item
  const isCurrentPage = useCallback((itemLinks: prismic.LinkField[]) => {
    if (!itemLinks || itemLinks.length === 0) return false;
    
    return itemLinks.some(link => {
      // Handle home page explicitly first
      if (pathname === '/') {
        // Check if this is a home link - either empty uid or url is '/'
        if (link.link_type === 'Document' && (!link.uid || link.uid === '')) {
          return true;
        }
        if ('url' in link && link.url === '/') {
          return true;
        }
      }
      
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

  // Check if current page matches the parent page (first link) of an item
  const isParentPage = useCallback((itemLinks: prismic.LinkField[]) => {
    if (!itemLinks || itemLinks.length === 0) return false;
    
    const parentLink = itemLinks[0];
    
    // Handle home page explicitly first
    if (pathname === '/') {
      // Check if this is a home link - either empty uid or url is '/'
      if (parentLink.link_type === 'Document' && (!parentLink.uid || parentLink.uid === '')) {
        return true;
      }
      if ('url' in parentLink && parentLink.url === '/') {
        return true;
      }
    }
    
    if (parentLink.link_type === 'Document' && parentLink.uid) {
      return pathname === `/${parentLink.uid}` || pathname === parentLink.uid;
    }
    if ('url' in parentLink && parentLink.url) {
      try {
        const linkUrl = parentLink.url.startsWith('/') ? parentLink.url : new URL(parentLink.url).pathname;
        return pathname === linkUrl;
      } catch {
        return pathname === parentLink.url;
      }
    }
    return false;
  }, [pathname]);

  // Check if current page matches any subpage (links after the first one) of an item
  const isSubPage = useCallback((itemLinks: prismic.LinkField[]) => {
    if (!itemLinks || itemLinks.length <= 1) return false;
    
    return itemLinks.slice(1).some(link => {
      // Handle home page explicitly first
      if (pathname === '/') {
        // Check if this is a home link - either empty uid or url is '/'
        if (link.link_type === 'Document' && (!link.uid || link.uid === '')) {
          return true;
        }
        if ('url' in link && link.url === '/') {
          return true;
        }
      }
      
      if (link.link_type === 'Document' && link.uid) {
        return pathname === `/${link.uid}` || pathname === link.uid;
      }
      if ('url' in link && link.url) {
        try {
          const linkUrl = link.url.startsWith('/') ? link.url : new URL(link.url).pathname;
          return pathname === linkUrl;
        } catch {
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
      isParent: isParentPage(item.links || []),
      isSubPage: isSubPage(item.links || []),
    }));
  }, [settings?.data?.items, isCurrentPage, isParentPage, isSubPage]);

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
            const state = currentPageStates[index] || { isParent: false, isSubPage: false };
            const isActive = state.isParent || state.isSubPage;
            return (
              <div 
                className="relative group" 
                key={index}
              >
                {/* First link - always visible */}
                {item.links && item.links[0] && (
                  <PrismicNextLink 
                    field={item.links[0]}
                    className={`block px-3 py-1.5 text-menu font-medium transition-colors ${
                      isActive
                        ? (isDarkMode 
                            ? 'text-white underline underline-offset-4' 
                            : 'text-black underline underline-offset-4')
                        : (isDarkMode 
                            ? 'text-white hover:text-gray-300' 
                            : 'hover:text-[#D7D2CB]')
                    }`}
                  >
                    {item.links[0].text || "Link"}
                  </PrismicNextLink>
                )}
              </div>
            );
          })}
        </div>

        {/* Sub-navigation row - only show when on subpage with multiple links */}
        <div className="relative h-12 flex items-start justify-center">
          {items?.map((item, index) => {
            const { hasMultipleLinks, isSubPage } = currentPageStates[index] || { hasMultipleLinks: false, isSubPage: false };
            const showSubNav = isSubPage && hasMultipleLinks;

            return (
              <div 
                key={`subnav-${index}`}
                aria-hidden={!showSubNav}
                className={`absolute top-0 left-1/2 transform -translate-x-1/2 flex justify-center gap-8 pt-2 px-4 py-2 transition-opacity duration-700 ease-in-out ${showSubNav ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <div className="flex justify-center gap-4">
                {item.links?.slice(1).map((link, linkIndex) => {
                  const isCurrentLink = isCurrentPage([link]);
                  
                  return (
                    <PrismicNextLink 
                      key={linkIndex} 
                      field={link}
                      className={`inline-block text-menu transition-colors px-3 py-1 ${
                        isCurrentLink
                          ? isDarkMode 
                            ? 'text-white underline underline-offset-4 font-medium' 
                            : 'text-black underline underline-offset-4 font-medium'
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
