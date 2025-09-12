import Link from "next/link";

interface LogoProps {
  variant?: 'default' | 'white';
}

export default function Logo({ variant = 'default' }: LogoProps) {
  const textColor = variant === 'white' ? 'text-white' : 'text-black';
  
  return (
    <Link href="/" className={textColor}>
      IE
    </Link>
  );
}
