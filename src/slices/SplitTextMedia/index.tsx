"use client";

import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
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
      className="flex min-h-screen"
    >
      {/* Left half - Sticky */}
      <div className="w-1/2 sticky top-8 h-screen flex flex-col items-center p-8">
        <StaggerContainer className="w-full flex flex-col items-center ">
          {slice.primary.heading && (
            <FadeInUp>
              <div className="text-h1 text-center mb-6 pt-8 pb-8">
                {asText(slice.primary.heading)}
              </div>
            </FadeInUp>
          )}
          
          {slice.primary.body && (
            <FadeInUp>
              <div className="text-center mx-auto w-3/5">
                {asText(slice.primary.body)}
              </div>
            </FadeInUp>
          )}
        </StaggerContainer>
      </div>
      
      {/* Right half - Scrollable */}
      <div className="w-1/2 overflow-y-auto">
        <StaggerContainer>
          <FadeInUp>
            <div className="aspect-square flex items-center justify-center">
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

          {slice.primary.items && slice.primary.items.length > 0 && (
            <div className="p-8 space-y-6 mb-8">
              {slice.primary.items.map((item, index) => (
                <FadeInUp key={index}>
                  <div className="bg-primary text-center px-20 rounded-lg pt-14 pb-14 transition-all duration-300 ease-in-out hover:shadow-2xl hover:translate-y-[-4px] hover:bg-white">
                    {item.headline && <h3 className="text-h4 mb-8 text-hyphenate max-w-full">{item.headline}</h3>}
                    {item.text && <p className="text-p1">{asText(item.text)}</p>}
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
