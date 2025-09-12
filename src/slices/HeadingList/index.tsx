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
      <div className="bg-primary pt-8 mx-auto w-3/5 mb-12">     
        <div className="text-center pb-6">
          {slice.primary.title && (
            <div className="uppercase font-medium">
              <PrismicRichText field={slice.primary.title} />
            </div>
          )}
        </div>
        
        {slice.primary.items && slice.primary.items.length > 0 && (
          <ul className="flex flex-col justify-center gap-4 pb-10">
            {slice.primary.items.map((item, index) => (
              <div className="w-full flex justify-center" key={index}>
                <li className="list-disc">
                  {item.text}
                </li>
              </div>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default HeadingList;
