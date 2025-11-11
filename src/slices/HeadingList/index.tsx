"use client";

import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@prismicio/react";
import { StaggerContainer, FadeInUp } from "@/lib/FramerStagger";

/**
 * Props for `HeadingList`.
 */
export type HeadingListProps = SliceComponentProps<Content.HeadingListSlice>;

/**
 * Component for "HeadingList" Slices.
 */
const HeadingList: FC<HeadingListProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StaggerContainer className="mx-auto px-4 md:px-0 md:w-3/5 mb-12" retriggerOnPathname>
        <FadeInUp className="rounded-lg bg-primary pt-8">
          <div>
            <FadeInUp>
              <div className="text-center pb-4 md:pb-6">
                {slice.primary.title && (
                  <div className="uppercase font-medium">
                    <PrismicRichText field={slice.primary.title} />
                  </div>
                )}
              </div>
            </FadeInUp>

            {slice.primary.items && slice.primary.items.length > 0 && (
              <ul className="flex flex-col justify-center gap-3 md:gap-4 pb-10">
                {slice.primary.items.map((item, index) => (
                  <FadeInUp key={index}>
                    <div className="w-full flex justify-center">
                      <li className="list-disc">{item.text}</li>
                    </div>
                  </FadeInUp>
                ))}
              </ul>
            )}
          </div>
        </FadeInUp>
      </StaggerContainer>
    </section>
  );
};

export default HeadingList;
