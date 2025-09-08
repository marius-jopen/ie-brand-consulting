import Link from "next/link";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors ${className}`}
    >
      IE Brand Consulting
    </Link>
  );
}
