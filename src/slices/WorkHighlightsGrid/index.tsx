"use client";

import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@prismicio/react";
import { StaggerContainer, FadeInUp } from "@/lib/FramerStagger";

/**
 * Props for `WorkHighlightsGrid`.
 */
export type WorkHighlightsGridProps =
  SliceComponentProps<Content.WorkHighlightsGridSlice>;

/**
 * Component for "WorkHighlightsGrid" Slices.
 */
const WorkHighlightsGrid: FC<WorkHighlightsGridProps> = ({ slice }) => {
  const projects = slice.primary.projects ?? [];
  const leftColumnProjects = projects.filter((_, i) => i % 2 === 0);
  const rightColumnProjects = projects.filter((_, i) => i % 2 === 1);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="pt-16 md:pt-20"
    >
      <StaggerContainer className="text-center pt-12 px-6 md:px-0">
        {slice.primary.section_title && (
          <FadeInUp>
            <h4 className="text-h4 pb-10">{asText(slice.primary.section_title)}</h4>
          </FadeInUp>
        )}
    
        {slice.primary.section_intro && (
          <FadeInUp>
            <div className="mx-auto w-full md:w-2/5 pb-8">
              <PrismicRichText field={slice.primary.section_intro} />
            </div>
          </FadeInUp>
        )}
        
        {slice.primary.section_cta && (
          <FadeInUp>
            <div className="mx-auto w-full md:w-2/5 pb-16 md:pb-24">
              <PrismicRichText field={slice.primary.section_cta} />
            </div>
          </FadeInUp>
        )}
      </StaggerContainer>
      
      {projects.length > 0 && (
        <div className="pb-12 mx-auto w-11/12 md:w-4/5">
          <div className="space-y-6">
            <StaggerContainer className="flex flex-col space-y-6" delayChildren={0.5} staggerChildren={0.6}>
              {projects.map((project, index) => (
                <FadeInUp key={`project-${index}`}>
                  <div className="text-center bg-primary rounded-lg pt-10 md:pt-12 pb-10 md:pb-12 px-6 md:px-8 break-inside-avoid transition-all duration-600 ease-in-out hover:shadow-2xl hover:translate-y-[-4px] hover:bg-white">
                    <div className="flex flex-wrap gap-2 justify-center pb-6 md:pb-8">
                      {project.project_category_full && <p>{project.project_category_full}</p>}
                    </div>

                    <div className="text-h6 pb-6 md:pb-8">
                      {project.project_title && <PrismicRichText field={project.project_title} />}
                    </div>

                    <div className="pb-6 md:pb-8 w-full md:w-4/5 mx-auto">
                      {project.project_quote && <PrismicRichText field={project.project_quote} />}
                    </div>

                    <div className="w-full md:w-4/5 mx-auto">
                      {project.project_services && <p>{project.project_services}</p>}
                    </div>
                  </div>
                </FadeInUp>
              ))}
            </StaggerContainer>
          </div>
        </div>
      )}
    </section>
  );
};

export default WorkHighlightsGrid;
