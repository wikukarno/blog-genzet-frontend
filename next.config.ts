import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "api-blog-genzet.wikukarno.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "api-blog-genzet.wikukarno.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
