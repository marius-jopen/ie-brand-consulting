"use client";
import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicImage } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import MorphingIconRemount from "@/lib/MorphingIconRemount";
import Button from "@/lib/Button";
import { StaggerContainer, FadeInUp } from "@/lib/FramerStagger";

/**
 * Props for `MediaCtaWithFeaturedContent`.
 */
export type MediaCtaWithFeaturedContentProps =
  SliceComponentProps<Content.MediaCtaWithFeaturedContentSlice>;

/**
 * Component for "MediaCtaWithFeaturedContent" Slices.
 */
const MediaCtaWithFeaturedContent: FC<MediaCtaWithFeaturedContentProps> = ({
  slice,
}) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mt-20 md:pt-0"
    >
    <div className="flex flex-col md:flex-row">
      <div
        className={`w-full md:w-1/2 ${
          slice.primary.featured_content && slice.primary.featured_content.length > 0
            ? "md:sticky md:top-20 md:h-screen"
            : ""
        }`}
      >
        <StaggerContainer className="px-6 md:px-8 pt-2 left-box">
          {slice.primary.media_title && (
            <FadeInUp>
              <h1 className="text-split text-center">{asText(slice.primary.media_title)}</h1>
            </FadeInUp>
          )}
          
          {/* Icon renders with morphing dots, chosen by keyword from Prismic field `icons` */}
          <FadeInUp>
            <div className="text-center flex h-[240px] md:h-[300px] items-center justify-center">
              <div className="w-44 md:w-[12vw] lg:w-[14vw] xl:w-[15vw] max-w-[280px] md:max-w-[320px] lg:max-w-[380px] aspect-square mx-auto">
                <MorphingIconRemount keyword={slice.primary.icons || undefined} width="100%" height="100%" />
              </div>
            </div>
          </FadeInUp>
          
          <FadeInUp>
            <div className="text-center pb-8 mx-6 md:mx-12 lg:mx-16 xl:mx-20 text-p4 md:mt-8 lg:mt-16 xl:mt-20">
              {asText(slice.primary.media_description)}
            </div>
          </FadeInUp>
          
          {slice.primary.media_links && slice.primary.media_links.length > 0 && (
            <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-4">
              {slice.primary.media_links.map((link, index) => (
                <FadeInUp key={index}>
                  <Button field={link}>
                    {link.text || "Media Link"}
                  </Button>
                </FadeInUp>
              ))}
            </div>
          )}
        </StaggerContainer>
      </div>
      
      <div className="w-full md:w-1/2 flex">
        <StaggerContainer className="pt-4 px-6 md:px-8 flex-1 flex mt-8 md:mt-0">
          {(!slice.primary.featured_content || slice.primary.featured_content.length === 0) && (
            <FadeInUp className="w-full flex">
              {slice.primary.image?.url ? (
                <div className="rounded-xl relative h-[80vh] w-full overflow-hidden bg-primary flex-1">
                  <PrismicImage
                    className="w-full h-full object-cover object-top mix-blend-multiply filter grayscale contrast-125 "
                    field={slice.primary.image}
                  />
                </div>
              ) : (
                <div className="w-full flex-1 bg-primary" />
              )}
            </FadeInUp>
          )}
          
          {slice.primary.featured_content && slice.primary.featured_content.length > 0 && (
            <div className="space-y-2 md:space-y-12 mt-8 md:mt-0">
              {slice.primary.featured_content.map((item, index) => (
                <FadeInUp key={index}>
                  <div className="group">
                    <div className="relative w-full overflow-hidden bg-white rounded-xl">
                      {item.image?.url ? (
                        <PrismicImage
                          className="w-full object-cover mix-blend-multiply  filter grayscale  transition duration-300 ease-out "
                          field={item.image}
                        />
                      ) : (
                        <div className="w-full aspect-[6/3] bg-primary transition duration-300 ease-out " />
                      )}
                    </div>

                    <div className="pb-10 md:pb-14 pt-4 px-2 md:px-0">
                      {item.eyebrow && <div className="pb-3 text-p4">{item.eyebrow}</div>}

                      {item.title && <div className="text-h8 pb-3 md:pb-6">{asText(item.title)}</div>}

                      {item.cta_link && (
                        <PrismicNextLink className="text-p4 underline underline-offset-4 decoration-1 decoration-transparent group-hover:decoration-black transition-colors duration-300" field={item.cta_link}>
                          {item.cta_link.text || "Learn more"}
                        </PrismicNextLink>
                      )}
                    </div>
                  </div>
                </FadeInUp>
              ))}
            </div>
          )}
        </StaggerContainer>
      </div>
    </div>
    </section>
  );
};

export default MediaCtaWithFeaturedContent;
