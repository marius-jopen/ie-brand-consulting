"use client";

import { useEffect, useRef, useState } from "react";
import { SettingsDocument } from "../../prismicio-types";
import Logo from "./logo";
import Navigation from "./navigation";

interface HeaderProps {
  settings: SettingsDocument;
  isDarkMode?: boolean;
}

export default function Header({ settings, isDarkMode = false }: HeaderProps) {
  const [isNavHidden, setIsNavHidden] = useState(false);
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
  
  const logoVariant = isDarkMode ? 'white' : 'default';
  const logoContainerClasses = `fixed top-4 left-4 z-10 transform transition-all duration-700 ease-in-out ${
    isNavHidden ? "-translate-y-10 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
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

          {/* Navigation - Fixed top center */}
          <div className={navContainerClasses}>
            <Navigation settings={settings} isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </header>
  );
}
