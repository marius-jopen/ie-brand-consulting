import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `HeroContentCentered`.
 */
export type HeroContentCenteredProps =
  SliceComponentProps<Content.HeroContentCenteredSlice>;

/**
 * Component for "HeroContentCentered" Slices.
 */
const HeroContentCentered: FC<HeroContentCenteredProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="bg-primary mx-11">
        {slice.primary.title && (
          <div className="text-h2 text-center pt-18">
            {asText(slice.primary.title)}
          </div>
        )}
        
        <div className="container mx-auto pb-20 mx-auto w-3/5 pt-22">
          {slice.primary.subtitle && (
            <div className="text-h7 text-center pb-8">
              {asText(slice.primary.subtitle)}
            </div>
          )}
          
          {slice.primary.description && (
            <div className="text-p1 text-center">
              {asText(slice.primary.description)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroContentCentered;
