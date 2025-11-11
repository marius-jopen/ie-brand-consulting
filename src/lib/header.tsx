"use client";

import { useEffect, useRef, useState } from "react";
import { SettingsDocument } from "../../prismicio-types";
import Logo from "./logo";
import Navigation from "./navigation";
import NavigationMobile from "./navigation-mobile";

interface HeaderProps {
  settings: SettingsDocument;
  isDarkMode?: boolean;
}

export default function Header({ settings, isDarkMode = false }: HeaderProps) {
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;

      // Small threshold to avoid flicker on tiny scrolls
      const threshold = 8;

      if (currentY <= 0) {
        setIsNavHidden(false);
      } else if (currentY > lastY + threshold) {
        // Scrolling down -> hide
        setIsNavHidden(true);
      } else if (currentY < lastY - threshold) {
        // Scrolling up -> show
        setIsNavHidden(false);
      }

      lastScrollYRef.current = currentY;
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll as EventListener);
  }, []);

  const headerClasses = isDarkMode 
    ? "bg-tertiary" 
    : "";
  
  // Show white logo when mobile menu is open OR in dark mode
  const logoVariant = (isDarkMode || isMobileMenuOpen) ? 'white' : 'default';
  const logoContainerClasses = `fixed top-4 left-4 z-50 transform transition-all duration-700 ease-in-out ${
    isNavHidden && !isMobileMenuOpen ? "-translate-y-10 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
  }`;
  const navContainerClasses = `fixed top-4 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-700 ease-in-out ${
    isNavHidden ? "-translate-y-10 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
  }`;

  return (
    <header className={headerClasses}>
      <div className="container mx-auto">
        <div className="relative w-full">
          {/* Logo - Fixed top left */}
          <div className={logoContainerClasses}>
            <Logo variant={logoVariant} />
          </div>

          {/* Desktop Navigation - Fixed top center - Hidden on mobile */}
          <div className={`hidden md:block ${navContainerClasses}`}>
            <Navigation settings={settings} isDarkMode={isDarkMode} />
          </div>

          {/* Mobile Navigation - Visible only on mobile */}
          <div className="md:hidden">
            <NavigationMobile 
              settings={settings} 
              isDarkMode={isDarkMode} 
              isNavHidden={isNavHidden}
              onMenuToggle={setIsMobileMenuOpen}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
