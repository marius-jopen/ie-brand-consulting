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
    <div>
      <div className="w-1/2">
        {slice.primary.media_title && (
          <h2 className="text-h2">{asText(slice.primary.media_title)}</h2>
        )}
        
        {slice.primary.icons && <p>Icons: {slice.primary.icons}</p>}
        
        {slice.primary.media_description && (
          <PrismicRichText field={slice.primary.media_description} />
        )}
        
        {slice.primary.media_links && slice.primary.media_links.length > 0 && (
          <div>
            {slice.primary.media_links.map((link, index) => (
              <PrismicLink className="bg-black text-white" key={index} field={link}>
                {link.text || "Media Link"}
              </PrismicLink>
            ))}
          </div>
        )}
      </div>
      
      <div className="w-1/2">
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
    </section>
  );
};

export default MediaCtaWithFeaturedContent;
