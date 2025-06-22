import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/FrontendAssessmentUI",
  output: "export",
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Monaco Editor поддержка
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
};

export default nextConfig;
