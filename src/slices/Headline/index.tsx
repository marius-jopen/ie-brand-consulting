import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicLink } from "@prismicio/react";

/**
 * Props for `Headline`.
 */
export type HeadlineProps = SliceComponentProps<Content.HeadlineSlice>;

/**
 * Component for "Headline" Slices.
 */
const Headline: FC<HeadlineProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="flex gap-4 flex-wrap">
        {slice.primary.items && slice.primary.items.map((item, index) => (
          <div key={index}>
            {/* {item.icon && <span>{item.icon}</span>} */}
            {item.title && (
              item.link ? (
                <PrismicLink field={item.link}>
                  <div className="text-h1">{item.title}</div>
                </PrismicLink>
              ) : (
                <div className="text-h1">{item.title}</div>
              )
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Headline;
