import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/broker-blast", destination: "/broker-blast/index.html" },
    ];
  },
};

export default nextConfig;
