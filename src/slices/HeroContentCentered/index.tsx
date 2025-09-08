import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@prismicio/react";

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
      {slice.primary.title && (
        <PrismicRichText field={slice.primary.title} />
      )}
      
      {slice.primary.subtitle && (
        <PrismicRichText field={slice.primary.subtitle} />
      )}
      
      {slice.primary.description && (
        <PrismicRichText field={slice.primary.description} />
      )}
    </section>
  );
};

export default HeroContentCentered;
