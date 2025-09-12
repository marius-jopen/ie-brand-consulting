import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText, PrismicImage, PrismicLink } from "@prismicio/react";

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
    >
    <div className="flex min-h-screen">
      <div className={`w-1/2 ${slice.primary.featured_content && slice.primary.featured_content.length > 0 ? 'sticky top-0 h-screen' : ''} overflow-y-auto`}>
        <div className="p-8">
          {slice.primary.media_title && (
            <h1 className="text-h1 text-center">{asText(slice.primary.media_title)}</h1>
          )}
          
          {/* {slice.primary.icons && <p>Icons: {slice.primary.icons}</p>} */}
          <div className="text-center flex h-[300px] items-center justify-center">
            ICON
          </div>
          
          <div className="text-center pb-8 mx-12">
            {slice.primary.media_description && (
              <PrismicRichText field={slice.primary.media_description} />
            )}
          </div>
          
          {slice.primary.media_links && slice.primary.media_links.length > 0 && (
            <div className="flex justify-center gap-4">
              {slice.primary.media_links.map((link, index) => (
                <PrismicLink className="bg-black text-white px-6 py-2" key={index} field={link}>
                  {link.text || "Media Link"}
                </PrismicLink>
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
                        <PrismicLink field={item.cta_link}>
                          {item.cta_link.text || "CTA Link"}
                        </PrismicLink>
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
