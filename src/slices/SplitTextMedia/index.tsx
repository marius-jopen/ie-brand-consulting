import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

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
      <div className="w-1/2 sticky top-0 h-screen flex flex-col justify-center items-center p-8">
        {slice.primary.heading && (
          <div className="text-h1 text-center mb-6">
            {asText(slice.primary.heading)}
          </div>
        )}
        
        {slice.primary.body && (
          <div className="text-center">
            {asText(slice.primary.body)}
          </div>
        )}
      </div>
      
      {/* Right half - Scrollable */}
      <div className="w-1/2 overflow-y-auto">
        {slice.primary.items && slice.primary.items.length > 0 && (
          <div className="p-8 space-y-6">
            {slice.primary.items.map((item, index) => (
              <div className="bg-primary text-center p-6 rounded-lg" key={index}>
                {item.headline && <h3 className="text-h5 mb-4">{item.headline}</h3>}
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
