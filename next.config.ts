import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const remotePatterns: RemotePattern[] = [
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
];

const imageURL = process.env.NEXT_PUBLIC_ASSET_URL;

if (imageURL) {
  try {
    const url = new URL(imageURL);
    const protocol = url.protocol.replace(":", "") as "http" | "https";

    remotePatterns.push(
      {
        protocol,
        hostname: url.hostname,
        pathname: "/storage/**",
      },
      {
        protocol,
        hostname: url.hostname,
        pathname: "/**",
      },
    );
  } catch {
    console.warn("Invalid NEXT_PUBLIC_ASSET_URL:", imageURL);
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
