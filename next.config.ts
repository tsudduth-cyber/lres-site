import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit"],
  outputFileTracingIncludes: {
    "/listings/flyers/[slug]": ["./lib/fonts/**", "./node_modules/pdfkit/js/data/**"],
  },
  async rewrites() {
    const host = [{ type: "host" as const, value: "listings.langrealestateservices.com" }];
    return {
      beforeFiles: [
        { source: "/", has: host, destination: "/listings" },
        { source: "/email", has: host, destination: "/listings/email" },
        { source: "/admin", has: host, destination: "/listings-admin.html" },
      ],
      afterFiles: [{ source: "/listings/admin", destination: "/listings-admin.html" }],
      fallback: [],
    };
  },
};

export default nextConfig;
