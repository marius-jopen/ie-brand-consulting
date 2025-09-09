import { FC } from "react";
import { Content, asText } from "@prismicio/client";
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
      <div className="w-1/2">
        {slice.primary.heading && (
          <div className="text-h1 text-center">
            {asText(slice.primary.heading)}
          </div>
        )}
        
        {slice.primary.body && (
          <div className="text-center">
            {asText(slice.primary.body)}
          </div>
        )}
      </div>
      
      <div className="w-1/2">
        {slice.primary.items && slice.primary.items.length > 0 && (
          <div>
            {slice.primary.items.map((item, index) => (
              <div className="bg-primary text-center" key={index}>
                {item.headline && <h3 className="text-h5">{item.headline}</h3>}
                {item.text && <p className="text-p1">{asText(item.text)}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SplitTextMedia;
