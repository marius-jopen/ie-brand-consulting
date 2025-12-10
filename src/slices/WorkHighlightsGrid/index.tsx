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
            <h4 className="text-project pb-10">{asText(slice.primary.section_title)}</h4>
          </FadeInUp>
        )}

        {slice.primary.section_cta && (
          <FadeInUp>
            <div className="mx-auto w-full md:w-2/5 pb-8 ">
              <PrismicRichText field={slice.primary.section_cta} />
            </div>
          </FadeInUp>
        )}
    
        {slice.primary.section_intro && (
          <FadeInUp>
            <div className="mx-auto w-full md:w-3/5  pb-16 md:pb-24">
              <PrismicRichText field={slice.primary.section_intro} />
            </div>
          </FadeInUp>
        )}
        
       
      </StaggerContainer>
      
      {projects.length > 0 && (
        <div className="pb-12 mx-auto w-full px-6 md:px-0 md:w-11/12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StaggerContainer className="flex flex-col" delayChildren={0.5} staggerChildren={0.6}>
              {leftColumnProjects.map((project, index) => (
                <FadeInUp key={`left-${index}`}>
                  <div className="text-center bg-primary rounded-lg md:pt-[32px] md:pb-[32px] pt-6 pb-6 px-4 md:px-[32px] mb-4 break-inside-avoid transition-all duration-600 ease-in-out hover:shadow-2xl hover:translate-y-[-4px] hover:bg-white">
                    <div className="flex gap-2 justify-center pb-8">
                      {project.project_category_full && <p>{project.project_category_full}</p>}
                    </div>

                    <div className="text-h6 pb-8">
                     {project.project_quote && <PrismicRichText field={project.project_quote} />}
                    </div>

                    <div className="w-4/5 mx-auto text-p5">
                      {project.project_services && <p>{project.project_services}</p>}
                    </div>
                  </div>
                </FadeInUp>
              ))}
            </StaggerContainer>
            <StaggerContainer className="flex flex-col" delayChildren={0.5} staggerChildren={0.6}>
              {rightColumnProjects.map((project, index) => (
                <FadeInUp key={`right-${index}`}>
                  <div className=" text-center bg-primary rounded-lg md:pt-[32px] md:pb-[32px] pt-6 pb-6 px-4 md:px-[32px] mb-4 break-inside-avoid transition-all duration-600 ease-in-out hover:shadow-2xl hover:translate-y-[-4px] hover:bg-white">
                    <div className="flex gap-2 justify-center pb-8">
                      {project.project_category_full && <p>{project.project_category_full}</p>}
                    </div>

                    <div className="text-h6 pb-8">
                      {project.project_quote && <PrismicRichText field={project.project_quote} />}
                    </div>

                    <div className="w-4/5 mx-auto text-p5">
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
