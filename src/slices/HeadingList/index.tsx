import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@prismicio/react";

/**
 * Props for `HeadingList`.
 */
export type HeadingListProps = SliceComponentProps<Content.HeadingListSlice>;

/**
 * Component for "HeadingList" Slices.
 */
const HeadingList: FC<HeadingListProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {slice.primary.title && (
        <PrismicRichText field={slice.primary.title} />
      )}
      
      {slice.primary.items && slice.primary.items.length > 0 && (
        <ul className="bg-primary">
          {slice.primary.items.map((item, index) => (
            <li key={index}>
              {item.text}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default HeadingList;
