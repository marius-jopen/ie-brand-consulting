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
      <div className="bg-primary container mx-auto">     
        <div className="text-center">
          {slice.primary.title && (
            <PrismicRichText field={slice.primary.title} />
          )}
        </div>
        
        {slice.primary.items && slice.primary.items.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-4">
            {slice.primary.items.map((item, index) => (
              <li key={index}>
                {item.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default HeadingList;
