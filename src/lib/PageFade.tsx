"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

export default function PageFade({ children }: PropsWithChildren) {
    const pathname = usePathname();

    return (
        <div key={pathname} className="page-fade">
            {children}
        </div>
    );
}


