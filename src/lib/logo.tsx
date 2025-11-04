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
  
  return (
    <Link 
      href="/" 
      className="relative flex items-center justify-start h-5 leading-none cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!showOpener ? (
        <Image
          src="/svgs/logo.svg"
          alt="IE Logo"
          width={747.69}
          height={567.82}
          className="h-5 w-auto scale-[1.15] translate-y-[-1px] translate-x-[2px]"
          priority
        />
      ) : (
        <Opener
          startFromIE
          onFinished={handleOpenerFinished}
          className="relative text-ultra-black flex items-center justify-start h-5 leading-none cursor-pointer"
          textClassName="whitespace-pre text-[30px] leading-none"
        />
      )}
    </Link>
  );
}
