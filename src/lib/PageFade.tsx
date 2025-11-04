"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

export default function PageFade({ children, className }: PropsWithChildren & { className?: string }) {
    const pathname = usePathname();

    return (
        <div key={pathname} className={["page-fade", className].filter(Boolean).join(" ")}> 
            {children}
        </div>
    );
}


