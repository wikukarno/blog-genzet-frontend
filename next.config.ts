import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

// Ambil domain dari environment variable
const imageDomain = process.env.NEXT_PUBLIC_ASSET_URL;

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

// Tambahkan domain dari ENV kalau ada
if (imageDomain) {
  remotePatterns.push({
    protocol: "https",
    hostname: imageDomain,
    pathname: "/storage/**",
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
