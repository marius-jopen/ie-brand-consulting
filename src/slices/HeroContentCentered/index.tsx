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
      <div className="bg-primary">
        {slice.primary.title && (
          <div className="text-h2 text-center">
            {asText(slice.primary.title)}
          </div>
        )}
        
        {slice.primary.subtitle && (
          <div className="text-h7 text-center">
            {asText(slice.primary.subtitle)}
          </div>
        )}
        
        {slice.primary.description && (
          <div className="text-p1 text-center">
            {asText(slice.primary.description)}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroContentCentered;
