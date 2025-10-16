"use client";

import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@prismicio/react";
import { StaggerContainer, FadeInUp, fadeInUpVariants } from "@/lib/FramerStagger";
import { motion } from "framer-motion";

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
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.05 }}
        variants={fadeInUpVariants}
        className="bg-primary rounded-lg pt-8 mx-auto w-3/5 mb-12"
      >
        <StaggerContainer>
          <FadeInUp>
            <div className="text-center pb-6">
              {slice.primary.title && (
                <div className="uppercase font-medium">
                  <PrismicRichText field={slice.primary.title} />
                </div>
              )}
            </div>
          </FadeInUp>
          
          {slice.primary.items && slice.primary.items.length > 0 && (
            <ul className="flex flex-col justify-center gap-4 pb-10">
              {slice.primary.items.map((item, index) => (
                <FadeInUp key={index}>
                  <div className="w-full flex justify-center">
                    <li className="list-disc">
                      {item.text}
                    </li>
                  </div>
                </FadeInUp>
              ))}
            </ul>
          )}
        </StaggerContainer>
      </motion.div>
    </section>
  );
};

export default HeadingList;
