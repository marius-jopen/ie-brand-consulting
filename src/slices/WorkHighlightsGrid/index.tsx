import { FC } from "react";
import { Content, asText } from "@prismicio/client";
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
      <div className="text-center">
        {slice.primary.section_title && (
          <h4 className="text-h4">{asText(slice.primary.section_title)}</h4>
        )}
    
        {slice.primary.section_intro && (
          <PrismicRichText field={slice.primary.section_intro} />
        )}
        
        {slice.primary.section_cta && (
          <PrismicRichText field={slice.primary.section_cta} />
        )}
      </div>
      
      {slice.primary.projects && slice.primary.projects.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {slice.primary.projects.map((project, index) => (
            <div className="text-center bg-primary" key={index}>
              <div className="flex gap-4 justify-center">
                {project.project_category_short && <p>{project.project_category_short}</p>}
                {project.project_category_full && <p>{project.project_category_full}</p>}
              </div>

              <div className="text-h6">
                {project.project_title && <PrismicRichText field={project.project_title} />}
              </div>

              <div>
                {project.project_quote && <PrismicRichText field={project.project_quote} />}
              </div>

              <div>
                {project.project_services && <p>{project.project_services}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default WorkHighlightsGrid;
