import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/assets/**",
      },
    ],
    // The Vendure asset server runs on localhost in dev, which the image
    // optimizer otherwise blocks as a private-IP target (SSRF protection).
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
