"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type PreviewData = {
  title: string;
  content: string;
  thumbnail: string | null;
  category: string;
  author: string;
  created_at: string;
};

export default function PreviewArticlePage() {
  const [preview, setPreview] = useState<PreviewData | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("preview-article");
    if (data) {
      setPreview(JSON.parse(data));
    }
  }, []);

  if (!preview) {
    return <p className="text-center py-20">No preview data found.</p>;
  }

  return (
    <div className="bg-white">
      {/* Navbar */}
      <div className="w-full border-b">
        <div className="max-w-5xl mx-auto px-4 py-8 flex items-center justify-between">
          <Image
            src="/logo.svg"
            alt="Logo"
            className="h-6"
            width={150}
            height={50}
          />
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
              {preview.author?.[0] || "A"}
            </div>
            {preview.author}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-10 py-10 px-4">
        {/* Header */}
        <header className="space-y-1 text-center">
          <p className="text-sm text-gray-400">
            {new Date(preview.created_at).toLocaleDateString()} • Created by{" "}
            {preview.author}
          </p>
          <h1 className="text-2xl font-bold leading-tight text-gray-900">
            {preview.title}
          </h1>
        </header>

        {/* Hero Image */}

        {preview.thumbnail && (
          <div className="rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview.thumbnail}
              alt="Hero"
              className="w-full object-cover rounded-lg"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        )}

        {/* Content */}
        <article className="prose max-w-none prose-sm sm:prose lg:prose-lg">
          <div dangerouslySetInnerHTML={{ __html: preview.content }} />
        </article>

        {/* Related Articles (static placeholder) */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Other articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg border overflow-hidden">
                <Image
                  src={`/sample-related-${i + 1}.jpg`}
                  alt="Related"
                  className="h-36 w-full object-cover"
                  width={400}
                  height={200}
                />
                <div className="p-4 space-y-1">
                  <p className="text-xs text-gray-400">April {13 - i}, 2025</p>
                  <h3 className="font-semibold text-sm">
                    Sample Related Article Title {i + 1}
                  </h3>
                  <div className="flex flex-wrap gap-1 text-xs text-blue-900">
                    <span className="px-2 py-1 bg-blue-200 rounded-full">
                      Technology
                    </span>
                    <span className="px-2 py-1 bg-blue-200 rounded-full">
                      Design
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="mt-12 text-sm text-white bg-[#2563EBDB] py-8">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-center gap-2">
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
    </div>
  );
}
