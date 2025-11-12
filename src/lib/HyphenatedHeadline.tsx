"use client";

import { FC, useMemo } from "react";
import Hypher from "hypher";
import patterns from "hyphenation.en-us";

interface HyphenatedHeadlineProps {
  text: string;
  className?: string;
}

// Create hyphenator instance with English patterns
const hyphenator = new Hypher(patterns);

/**
 * Component that applies proper grammatical hyphenation to headline text
 */
const HyphenatedHeadline: FC<HyphenatedHeadlineProps> = ({ text, className = "" }) => {
  const hyphenatedText = useMemo(() => {
    if (!text) return "";
    
    // Split text into words and hyphenate each word
    return text
      .split(/(\s+)/) // Split by whitespace but keep the spaces
      .map((word) => {
        // Only hyphenate actual words (not spaces or punctuation)
        if (word.trim().length === 0) return word;
        
        // Hyphenate the word using soft hyphens (&shy;)
        return hyphenator.hyphenateText(word);
      })
      .join("");
  }, [text]);

  return (
    <h3 className={className} dangerouslySetInnerHTML={{ __html: hyphenatedText }} />
  );
};

export default HyphenatedHeadline;

