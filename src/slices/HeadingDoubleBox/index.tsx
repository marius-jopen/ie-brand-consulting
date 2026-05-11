"use client";

import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { StaggerContainer, FadeInUp } from "@/lib/FramerStagger";

export type HeadingDoubleBoxProps =
  SliceComponentProps<Content.HeadingDoubleBoxSlice>;

type BoxProps = {
  title: Content.HeadingDoubleBoxSliceDefaultPrimary["title_left"];
  description: Content.HeadingDoubleBoxSliceDefaultPrimary["description_left"];
  items: Content.HeadingDoubleBoxSliceDefaultPrimary["items_left"];
  leftAligned: boolean;
};

const Box: FC<BoxProps> = ({ title, description, items, leftAligned }) => {
  return (
    <FadeInUp className="rounded-lg bg-primary p-6 md:p-8 flex-1 flex flex-col">
      {isFilled.richText(title) && (
        <FadeInUp>
          <div className="uppercase font-medium text-center pb-4 md:pb-6">
            <PrismicRichText field={title} />
          </div>
        </FadeInUp>
      )}

      {isFilled.richText(description) && (
        <FadeInUp>
          <div className={`pb-4 ${leftAligned ? "text-left" : "text-center"}`}>
            <PrismicRichText field={description} />
          </div>
        </FadeInUp>
      )}

      {items && items.length > 0 && (
        <div
          className={`flex flex-col gap-2 md:gap-3 ${
            leftAligned ? "items-start" : "items-center"
          }`}
        >
          {items.map((item, index) => (
            <FadeInUp
              key={index}
              className={`flex w-full ${
                leftAligned ? "justify-start" : "justify-center"
              }`}
            >
              <div className="flex items-start gap-2 max-w-[90%] md:max-w-none">
                <span
                  className={`flex-1 ${
                    leftAligned ? "text-left" : "text-center break-words"
                  }`}
                >
                  <span className="text-current inline-block translate-y-[-2px] text-[0.5rem] mr-2">
                    •
                  </span>
                  {item.text}
                </span>
              </div>
            </FadeInUp>
          ))}
        </div>
      )}
    </FadeInUp>
  );
};

const HeadingDoubleBox: FC<HeadingDoubleBoxProps> = ({ slice }) => {
  const leftAligned = slice.primary.left_aligned === true;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StaggerContainer
        className="mx-auto px-4 md:px-0 md:w-3/5 mb-12 flex flex-col md:flex-row gap-4 md:gap-6 items-stretch"
        retriggerOnPathname
      >
        <Box
          title={slice.primary.title_left}
          description={slice.primary.description_left}
          items={slice.primary.items_left}
          leftAligned={leftAligned}
        />
        <Box
          title={slice.primary.title_right}
          description={slice.primary.description_right}
          items={slice.primary.items_right}
          leftAligned={leftAligned}
        />
      </StaggerContainer>
    </section>
  );
};

export default HeadingDoubleBox;
