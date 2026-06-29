import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/thebrandread",
        destination: "/thebrandread.pdf",
      },
    ];
  },
};

export default nextConfig;
