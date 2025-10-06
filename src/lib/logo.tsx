import Link from "next/link";
import Opener from "@/lib/Opener";

interface LogoProps {
  variant?: 'default' | 'white';
}

export default function Logo({ variant = 'default' }: LogoProps) {
  const textColor = variant === 'white' ? 'text-white' : 'text-black';
  
  return (
    <Link href="/" className={textColor}>
      <Opener
        startFromIE
        className="relative flex items-center justify-start h-5 leading-none cursor-pointer"
        textClassName="whitespace-pre text-[20px] leading-none"
      />
    </Link>
  );
}
