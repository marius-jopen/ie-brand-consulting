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
      {slice.primary.icons && <p>Icons: {slice.primary.icons ? "Yes" : "No"}</p>}
      
      {slice.primary.items && slice.primary.items.length > 0 && (
        <div>
          {slice.primary.items.map((item, index) => (
            <div key={index}>
              {item.icon && <span>{item.icon}</span>}
              {item.title && <h2>{item.title}</h2>}
              {item.link && (
                <PrismicLink field={item.link}>
                  {item.link.text || "Link"}
                </PrismicLink>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default StackedHeadings;
