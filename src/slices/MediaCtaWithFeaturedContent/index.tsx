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
      className="pt-30"
    >
    <div className="flex min-h-full">
      <div className={`w-1/2 ${slice.primary.featured_content && slice.primary.featured_content.length > 0 ? 'sticky top-30 h-screen' : ''} overflow-y-auto`}>
        <StaggerContainer className="p-8">
          {slice.primary.media_title && (
            <FadeInUp>
              <h1 className="text-h1 text-center">{asText(slice.primary.media_title)}</h1>
            </FadeInUp>
          )}
          
          {/* Icon renders with morphing dots, chosen by keyword from Prismic field `icons` */}
          <FadeInUp>
            <div className="text-center flex h-[300px] items-center justify-center">
              <div className="w-[15vw] max-w-[500px] aspect-square">
                <MorphingIconRemount keyword={slice.primary.icons || undefined} width="100%" height="100%" />
              </div>
            </div>
          </FadeInUp>
          
          <FadeInUp>
            <div className="text-center pb-8 mx-12 text-p4">
              {asText(slice.primary.media_description)}
            </div>
          </FadeInUp>
          
          {slice.primary.media_links && slice.primary.media_links.length > 0 && (
            <div className="flex justify-center gap-4">
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
      
      <div className="w-1/2 overflow-y-auto">
        <StaggerContainer className="p-8 h-full">
          {(!slice.primary.featured_content || slice.primary.featured_content.length === 0) && (
            <FadeInUp>
              {slice.primary.image?.url ? (
                <PrismicImage className="h-full object-cover" field={slice.primary.image} />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </FadeInUp>
          )}
          
          {slice.primary.featured_content && slice.primary.featured_content.length > 0 && (
            <div>
              {slice.primary.featured_content.map((item, index) => (
                <FadeInUp key={index}>
                  <div className="group">
                    {item.image?.url ? (
                      <PrismicImage className="w-full transition duration-300 ease-out filter group-hover:brightness-90" field={item.image} />
                    ) : (
                      <div className="w-full aspect-[6/3] bg-primary transition duration-300 ease-out filter group-hover:brightness-90" />
                    )}

                    <div className="pb-14 pt-4">
                      {item.eyebrow && <div className="pb-3 text-p4">{item.eyebrow}</div>}

                      {item.title && <div className="text-h8 pb-6">{asText(item.title)}</div>}

                      {item.cta_link && (
                        <PrismicNextLink className="text-p4 underline underline-offset-4 decoration-1 decoration-transparent group-hover:decoration-black transition-colors duration-300" field={item.cta_link}>
                          {item.cta_link.text || "CTA Link"}
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
