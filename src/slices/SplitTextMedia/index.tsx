import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@prismicio/react";

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
    >
      {slice.primary.heading && (
        <PrismicRichText field={slice.primary.heading} />
      )}
      
      {slice.primary.body && (
        <PrismicRichText field={slice.primary.body} />
      )}
      
      {slice.primary.items && slice.primary.items.length > 0 && (
        <div>
          {slice.primary.items.map((item, index) => (
            <div key={index}>
              {item.headline && <h3>{item.headline}</h3>}
              {item.text && <PrismicRichText field={item.text} />}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SplitTextMedia;
