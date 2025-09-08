import { FC } from "react";
import { Content } from "@prismicio/client";
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
      {slice.primary.media_title && (
        <PrismicRichText field={slice.primary.media_title} />
      )}
      
      {slice.primary.icons && <p>Icons: {slice.primary.icons}</p>}
      
      {slice.primary.media_description && (
        <PrismicRichText field={slice.primary.media_description} />
      )}
      
      {slice.primary.media_links && slice.primary.media_links.length > 0 && (
        <div>
          {slice.primary.media_links.map((link, index) => (
            <PrismicLink key={index} field={link}>
              {link.text || "Media Link"}
            </PrismicLink>
          ))}
        </div>
      )}
      
      {slice.primary.image && (
        <PrismicImage field={slice.primary.image} />
      )}
      
      {slice.primary.featured_content && slice.primary.featured_content.length > 0 && (
        <div>
          {slice.primary.featured_content.map((item, index) => (
            <div key={index}>
              {item.image && <PrismicImage field={item.image} />}
              {item.eyebrow && <p>{item.eyebrow}</p>}
              {item.title && <PrismicRichText field={item.title} />}
              {item.cta_link && (
                <PrismicLink field={item.cta_link}>
                  {item.cta_link.text || "CTA Link"}
                </PrismicLink>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MediaCtaWithFeaturedContent;
