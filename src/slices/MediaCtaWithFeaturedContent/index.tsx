"use client";
import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText, PrismicImage } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import MorphingIconRemount from "@/lib/MorphingIconRemount";
import Button from "@/lib/Button";

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
      <div className={`w-1/2 ${slice.primary.featured_content && slice.primary.featured_content.length > 0 ? 'sticky top-0 h-screen' : ''} overflow-y-auto`}>
        <div className="p-8">
          {slice.primary.media_title && (
            <h1 className="text-h1 text-center">{asText(slice.primary.media_title)}</h1>
          )}
          
          {/* Icon renders with morphing dots, chosen by keyword from Prismic field `icons` */}
          <div className="text-center flex h-[300px] items-center justify-center">
            <div className="w-[15vw] max-w-[500px] aspect-square">
              <MorphingIconRemount keyword={slice.primary.icons || undefined} width="100%" height="100%" />
            </div>
          </div>
          
          <div className="text-center pb-8 mx-12 text-p4">
            {asText(slice.primary.media_description)}
          </div>
          
          {slice.primary.media_links && slice.primary.media_links.length > 0 && (
            <div className="flex justify-center gap-4">
              {slice.primary.media_links.map((link, index) => (
                <Button key={index} field={link}>
                  {link.text || "Media Link"}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="w-1/2 overflow-y-auto">
        <div className="p-8 h-full">
          {slice.primary.image && (
            <PrismicImage className="h-full object-cover" field={slice.primary.image} />
          )}
          
          {slice.primary.featured_content && slice.primary.featured_content.length > 0 && (
            <div>
              {slice.primary.featured_content.map((item, index) => (
                <div key={index}>
                  {item.image && <PrismicImage field={item.image} />}

                  <div className="pb-14 pt-4">
                      {item.eyebrow && <div className="pb-2">{item.eyebrow}</div>}

                      {item.title && <div className="text-h7 pb-4">{asText(item.title)}</div>}

                      {item.cta_link && (
                        <Button field={item.cta_link}>
                          {item.cta_link.text || "CTA Link"}
                        </Button>
                      )}
                    </div>
                  </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </section>
  );
};

export default MediaCtaWithFeaturedContent;
