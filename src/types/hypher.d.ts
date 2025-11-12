declare module 'hypher' {
  interface HypherPattern {
    patterns: Record<string, string>;
    leftmin: number;
    rightmin: number;
  }

  class Hypher {
    constructor(patterns: HypherPattern);
    hyphenateText(text: string, hyphenChar?: string): string;
    hyphenate(word: string): string[];
  }

  export default Hypher;
}

declare module 'hyphenation.en-us' {
  import { HypherPattern } from 'hypher';
  const patterns: HypherPattern;
  export default patterns;
}

