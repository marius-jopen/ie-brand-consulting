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
      <div className="w-1/2 sticky top-0 h-screen overflow-y-auto">
        <div className="p-8">
          {slice.primary.media_title && (
            <h2 className="text-h2 text-center">{asText(slice.primary.media_title)}</h2>
          )}
          
          {/* {slice.primary.icons && <p>Icons: {slice.primary.icons}</p>} */}
          
          <div className="text-center">
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
        <div className="p-8">
          {slice.primary.image && (
            <PrismicImage field={slice.primary.image} />
          )}
          
          {slice.primary.featured_content && slice.primary.featured_content.length > 0 && (
            <div>
              {slice.primary.featured_content.map((item, index) => (
                <div key={index}>
                  {item.image && <PrismicImage field={item.image} />}

                  <div>
                      {item.eyebrow && <div>{item.eyebrow}</div>}

                        {item.title && <h7 className="text-h7">{asText(item.title)}</h7>}

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
