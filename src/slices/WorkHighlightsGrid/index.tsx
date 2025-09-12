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
      <div className="text-center pt-12">
        {slice.primary.section_title && (
          <h4 className="text-h4 pb-10">{asText(slice.primary.section_title)}</h4>
        )}
    
        {slice.primary.section_intro && (
          <div className="mx-auto w-2/5 pb-8">
            <PrismicRichText field={slice.primary.section_intro} />
          </div>
        )}
        
        {slice.primary.section_cta && (
          <div className="mx-auto w-2/5 pb-24">
            <PrismicRichText field={slice.primary.section_cta} />
          </div>
        )}
      </div>
      
      {slice.primary.projects && slice.primary.projects.length > 0 && (
        <div className="columns-2 gap-4 pb-12 mx-auto w-11/12">
          {slice.primary.projects.map((project, index) => (
            <div className="text-center bg-primary rounded-lg pt-12 pb-12 px-8 mb-4 break-inside-avoid" key={index}>
              <div className="flex gap-2 justify-center pb-8">
                {project.project_category_short && <p className="font-bold">{project.project_category_short}</p>}
                {project.project_category_full && <p>{project.project_category_full}</p>}
              </div>

              <div className="text-h6 pb-8">
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
