import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit"],
  outputFileTracingIncludes: {
    "/listings/flyers/[slug]": ["./lib/fonts/**", "./node_modules/pdfkit/js/data/**"],
  },
  async rewrites() {
    return [{ source: "/listings/admin", destination: "/listings-admin.html" }];
  },
};

export default nextConfig;
