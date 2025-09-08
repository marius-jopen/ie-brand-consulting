import { PrismicLink } from "@prismicio/react";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <PrismicLink
      field={{ link_type: "Document", type: "page", uid: "home" }}
      className={`text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors ${className}`}
    >
      IE Brand Consulting
    </PrismicLink>
  );
}
