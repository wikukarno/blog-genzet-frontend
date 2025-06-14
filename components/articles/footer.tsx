import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12 text-sm text-white bg-[#2563EBDB] py-8">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-2 text-center">
        <Image
          src="/logo-white.svg"
          alt="Logo"
          className="h-4"
          width={80}
          height={20}
        />
        <span className="text-white">
          © 2025 Blog @onzet. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
