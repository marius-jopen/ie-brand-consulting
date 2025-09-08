import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@prismicio/react";

/**
 * Props for `WorkHighlightsGrid`.
 */
export type WorkHighlightsGridProps =
  SliceComponentProps<Content.WorkHighlightsGridSlice>;

/**
 * Component for "WorkHighlightsGrid" Slices.
 */
const WorkHighlightsGrid: FC<WorkHighlightsGridProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {slice.primary.section_title && (
        <PrismicRichText field={slice.primary.section_title} />
      )}
      
      {slice.primary.section_intro && (
        <PrismicRichText field={slice.primary.section_intro} />
      )}
      
      {slice.primary.section_cta && (
        <PrismicRichText field={slice.primary.section_cta} />
      )}
      
      {slice.primary.projects && slice.primary.projects.length > 0 && (
        <div>
          {slice.primary.projects.map((project, index) => (
            <div key={index}>
              {project.project_category_short && <p>Category: {project.project_category_short}</p>}
              {project.project_category_full && <p>Full Category: {project.project_category_full}</p>}
              {project.project_title && <PrismicRichText field={project.project_title} />}
              {project.project_quote && <PrismicRichText field={project.project_quote} />}
              {project.project_services && <p>Services: {project.project_services}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default WorkHighlightsGrid;
