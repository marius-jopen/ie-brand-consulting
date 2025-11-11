"use client";

import { useState, useEffect } from "react";
import { PrismicNextLink } from "@prismicio/next";
import { SettingsDocument } from "../../prismicio-types";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationMobileProps {
  settings: SettingsDocument;
  isDarkMode?: boolean;
  isNavHidden?: boolean;
  onMenuToggle?: (isOpen: boolean) => void;
}

export default function NavigationMobile({ settings, isDarkMode = false, isNavHidden = false, onMenuToggle }: NavigationMobileProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Cleanup on unmount
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!settings?.data) {
    return null;
  }

  const { items, socials } = settings.data;

  // Toggle menu
  const toggleMenu = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onMenuToggle?.(newIsOpen);
  };

  // Color classes based on dark mode and menu state
  const dotColor = isDarkMode 
    ? (isOpen ? "bg-white" : "bg-white") 
    : (isOpen ? "bg-white" : "bg-black");
  
  const overlayBg = isDarkMode ? "bg-quinary" : "bg-quinary";
  const textColor = "text-white";

  // Dot container classes with scroll animation
  const dotContainerClasses = `fixed -top-1 right-0 z-50 transform transition-all duration-700 ease-in-out ${
    isNavHidden && !isOpen ? "-translate-y-10 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
  }`;

  return (
    <>
      {/* Dot Button - Fixed top right */}
      <div className={dotContainerClasses}>
        <button
          onClick={toggleMenu}
          className="w-16 h-16 flex items-center justify-center"
          aria-label="Toggle menu"
        >
          <div className={`w-6 h-6 rounded-full transition-colors duration-300 ${dotColor}`} />
        </button>
      </div>

      {/* Full Screen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className={`fixed inset-0 z-40 ${overlayBg} flex flex-col items-center justify-center ${textColor}`}
          >
            {/* Navigation Items - Centered */}
            <nav className="flex flex-col items-center space-y-1">
              {items?.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.2 + index * 0.15,
                    duration: 0.8,
                    ease: "easeOut"
                  }}
                >
                  {item.links && item.links[0] && (
                    <PrismicNextLink
                      field={item.links[0]}
                      className="text-h0 font-bold hover:text-gray-300 transition-colors"
                      onClick={() => {
                        setIsOpen(false);
                        onMenuToggle?.(false);
                      }}
                    >
                      {item.links[0].text || "Link"}
                    </PrismicNextLink>
                  )}
                </motion.div>
              ))}
            </nav>

            {/* Social Links - Fixed at Bottom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.6,
                duration: 0.8,
                ease: "easeOut"
              }}
              className="fixed bottom-8 left-0 right-0 flex justify-center gap-8 text-p3"
            >
              {socials && socials.length > 0 && socials.map((social, index) => (
                <PrismicNextLink
                  key={index}
                  field={social}
                  className="hover:text-gray-300 transition-colors"
                  onClick={() => {
                    setIsOpen(false);
                    onMenuToggle?.(false);
                  }}
                >
                  {social.text || "Social Link"}
                </PrismicNextLink>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

