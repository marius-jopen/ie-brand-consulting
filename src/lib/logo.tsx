"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Opener from "@/lib/Opener";

interface LogoProps {
  variant?: 'default' | 'white';
}

export default function Logo({ variant = 'default' }: LogoProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [showOpener, setShowOpener] = useState(false);
  
  const handleMouseEnter = () => {
    setIsHovering(true);
    setShowOpener(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    // Don't hide opener immediately - wait for reverse animation to complete
  };
  
  const handleOpenerFinished = () => {
    // Reverse animation completed, now hide the opener
    setShowOpener(false);
  };
  
  const logoSrc = variant === 'white' ? '/svgs/logo-white.svg' : '/svgs/logo.svg';
  // Opener uses text-ultra-black font (gt_ultra_fineblack) for both variants
  // Only the text color changes: white for dark mode, ultra-black for light mode
  // The dot is always gold (text-quaternary) in both variants
  const openerTextColor = variant === 'white' ? 'text-white' : 'text-ultra-black';
  const openerDotColor = 'text-quaternary'; // Always gold, regardless of variant
  // Logo dimensions - white logo has slightly different viewBox but same aspect ratio
  const logoWidth = variant === 'white' ? 747.7 : 747.69;
  const logoHeight = variant === 'white' ? 567.8 : 567.82;

  return (
    <Link 
      href="/" 
      className="relative flex items-center justify-start h-5 leading-none cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!showOpener ? (
        <Image
          src={logoSrc}
          alt="IE Logo"
          width={logoWidth}
          height={logoHeight}
          className="h-5 w-auto scale-[1.15] translate-y-[-1px] translate-x-[2px]"
          priority
        />
      ) : (
        <Opener
          startFromIE
          onFinished={handleOpenerFinished}
          className={`relative ${openerTextColor} flex items-center justify-start h-5 leading-none cursor-pointer`}
          textClassName={`whitespace-pre text-[30px] leading-none text-ultra-black ${openerTextColor}`}
          dotClassName={openerDotColor}
        />
      )}
    </Link>
  );
}
