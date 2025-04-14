import type { NextConfig } from "next";

const config: NextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: "/:path*",
          destination: "/404",
        },
      ],
    };
  },
};

export default config;
