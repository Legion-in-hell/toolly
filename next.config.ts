import type { NextConfig } from "next";

const config: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/tools",
        destination: "/",
        permanent: true,
      },
    ];
  },
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
