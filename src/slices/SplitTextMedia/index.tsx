"use client";

import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import ToggleMorphingIconRemount from "@/lib/ToggleMorphingIconRemount";
import { StaggerContainer, FadeInUp } from "@/lib/FramerStagger";

/**
 * Props for `SplitTextMedia`.
 */
export type SplitTextMediaProps =
  SliceComponentProps<Content.SplitTextMediaSlice>;

/**
 * Component for "SplitTextMedia" Slices.
 */
const SplitTextMedia: FC<SplitTextMediaProps> = ({ slice }) => {

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="flex flex-col md:flex-row min-h-screen"
    >
      {/* Left half - Sticky */}
      <div className="w-full md:w-1/2 md:sticky md:top-0 md:h-screen flex flex-col items-center p-8 md:mb-0 mb-10">
        <StaggerContainer className="w-full flex flex-col items-center">
          {slice.primary.heading && (
            <FadeInUp>
              <div className="text-split text-center mb-6 pt-0 pb-2 md:pb-8">
                {asText(slice.primary.heading)}
              </div>
            </FadeInUp>
          )}

          <FadeInUp>
            <div className="aspect-square flex md:hidden items-center justify-center">
              <div className="w-[60vw] max-w-[500px] aspect-square mt-10 mb-0 ">
                <ToggleMorphingIconRemount
                  width="100%"
                  height="100%"
                  firstId="question-1"
                  secondId="question-2"
                  trigger="viewport"
                  palette={[
                    { id: "question-1", url: "/svgs/question-1.svg" },
                    { id: "question-2", url: "/svgs/question-2.svg" },
                  ]}
                />
              </div>
            </div>
          </FadeInUp>
          
          {slice.primary.body && (
            <FadeInUp>
              <div className="hidden md:block text-center mx-auto w-full md:w-4/5">
                <PrismicRichText field={slice.primary.body} />
              </div>
            </FadeInUp>
          )}
        </StaggerContainer>
      </div>
      
      {/* Right half - Scrollable */}
      <div className="w-full md:w-1/2 overflow-y-auto">
        <StaggerContainer>
          <FadeInUp>
            <div className="aspect-square  items-center justify-center  hidden md:flex">
              <div className="w-[40vw] max-w-[500px] aspect-square mt-20 mb-20">
                <ToggleMorphingIconRemount
                  width="100%"
                  height="100%"
                  firstId="question-1"
                  secondId="question-2"
                  trigger="hover"
                  palette={[
                    { id: "question-1", url: "/svgs/question-1.svg" },
                    { id: "question-2", url: "/svgs/question-2.svg" },
                  ]}
                />
              </div>
            </div>
          </FadeInUp>

             
          {slice.primary.body && (
            <FadeInUp>
              <div className="md:hidden text-center mx-auto w-full md:w-3/5 mb-8 px-8">
                <PrismicRichText field={slice.primary.body} />
              </div>
            </FadeInUp>
          )}

          {slice.primary.items && slice.primary.items.length > 0 && (
            <div className="py-4 md:py-8 space-y-4 md:space-y-6 mb-8 px-4">
              {slice.primary.items.map((item, index) => (
                <FadeInUp key={index}>
                  <div className="flex flex-col justify-center aspect-square bg-primary text-center  rounded-lg pt-4 md:pt-14 pb-4 md:pb-14 transition-all duration-300 ease-in-out hover:shadow-xl hover:translate-y-[-4px] hover:bg-white">
                    {item.headline && <h3 className="text-h9 mb-8 px-4 max-w-full">{item.headline}</h3>}
                    {item.text && <p className="text-p1 pb-4 px-4 md:px-20">{asText(item.text)}</p>}
                  </div>
                </FadeInUp>
              ))}
            </div>
          )}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default SplitTextMedia;
