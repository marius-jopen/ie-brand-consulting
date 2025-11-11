"use client";

import { useState } from "react";
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
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-40 ${overlayBg} flex flex-col items-center justify-center ${textColor}`}
          >
            {/* Navigation Items */}
            <nav className="flex flex-col items-center space-y-8 mb-16">
              {items?.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  {item.links && item.links[0] && (
                    <PrismicNextLink
                      field={item.links[0]}
                      className="text-h2 font-bold hover:text-gray-300 transition-colors"
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

            {/* Social Links at Bottom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-8 text-p3"
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

