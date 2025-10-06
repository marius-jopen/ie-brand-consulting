"use client";

import { useEffect, useMemo, useState } from "react";

type SectionInfo = {
  id: string;
  element: HTMLElement;
};

interface SectionDotsNavProps {
  enabled?: boolean;
}

export default function SectionDotsNav({ enabled = true }: SectionDotsNavProps) {
  const [sections, setSections] = useState<SectionInfo[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Collect sections rendered by slices. Each slice uses a <section> with data attributes.
  useEffect(() => {
    if (!enabled) return;

    const nodeList = document.querySelectorAll<HTMLElement>(
      "section[data-slice-type]"
    );
    const list: SectionInfo[] = Array.from(nodeList).map((el, index) => ({
      id: el.id || `section-${index + 1}`,
      element: el,
    }));

    // Ensure each section has an id for anchor scroll
    list.forEach((s, index) => {
      if (!s.element.id) s.element.id = `section-${index + 1}`;
    });

    setSections(list);

    const onScroll = () => {
      const scrollY = window.scrollY;
      const viewportCenter = scrollY + window.innerHeight * 0.35;
      let current = 0;
      for (let i = 0; i < list.length; i++) {
        const rect = list[i].element.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        if (top <= viewportCenter) current = i; else break;
      }
      setActiveIndex(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled]);

  const isVisible = useMemo(() => enabled && sections.length > 1, [enabled, sections.length]);

  if (!isVisible) return null;

  const handleClick = (index: number) => {
    const target = sections[index];
    if (target) {
      target.element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      aria-label="Section navigation"
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 pointer-events-auto hidden md:flex flex-col gap-12"
    >
      {sections.map((s, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={s.id}
            aria-label={`Go to section ${index + 1}`}
            aria-current={isActive ? "true" : undefined}
            onClick={() => handleClick(index)}
            className={
              "transition-transform focus:outline-none cursor-pointer" +
              (isActive ? " scale-100" : " opacity-60 hover:opacity-100")
            }
          >
            <span
              className={
                "block rounded-full" +
                (isActive
                  ? " w-3.5 h-3.5 bg-black"
                  : " w-3.5 h-3.5 bg-gray-300")
              }
            />
          </button>
        );
      })}
    </nav>
  );
}


