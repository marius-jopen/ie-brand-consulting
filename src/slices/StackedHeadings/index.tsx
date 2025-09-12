import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicLink } from "@prismicio/react";

/**
 * Props for `StackedHeadings`.
 */
export type StackedHeadingsProps =
  SliceComponentProps<Content.StackedHeadingsSlice>;

/**
 * Component for "StackedHeadings" Slices.
 */
const StackedHeadings: FC<StackedHeadingsProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {/* {slice.primary.icons && <p>Icons: {slice.primary.icons ? "Yes" : "No"}</p>} */}
      
      {slice.primary.items && slice.primary.items.length > 0 && (
        <div className="pt-10 pb-20">
          {slice.primary.items.map((item, index) => (
            <div className="text-center" key={index}>
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
      )}
    </section>
  );
};

export default StackedHeadings;
