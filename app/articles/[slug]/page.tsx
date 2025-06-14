"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getArticleBySlug, getArticles } from "@/services/article-service";
import ArticleCard from "@/components/articles/article-card";
import Footer from "@/components/articles/footer";
import Header from "@/components/layout/header";

type PreviewData = {
  id: number;
  title: string;
  content: string;
  thumbnail: string | null;
  category: { id: number; name: string } | null;
  user: { username: string };
  created_at: string;
  slug: string;
};

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

export default function PreviewArticlePage() {
  const { slug } = useParams();
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [related, setRelated] = useState<PreviewData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const article = await getArticleBySlug(slug as string);
        setPreview(article);

        const categoryId = article.category?.id;
        if (!categoryId) {
          return;
        }

        const relatedArticles = await getArticles("", 1, categoryId);

        const filtered = relatedArticles.data.filter(
          (a: PreviewData) => a.id !== article.id,
        );

        setRelated(filtered.slice(0, 3));
      } catch {
        setError("Failed to fetch article or related articles.");
      }
    };

    if (slug) fetchData();
  }, [slug]);

  if (error) {
    return <p className="text-center py-20 text-red-500">{error}</p>;
  }

  if (!preview) {
    return <p className="text-center py-20">Loading preview article...</p>;
  }

  return (
    <div className="bg-white">
      {/* Navbar */}
      <Header />

      {/* Artikel */}
      <div className="max-w-4xl mx-auto space-y-10 py-10 px-4">
        <header className="space-y-1 text-center">
          <p className="text-sm text-gray-400">
            {new Date(preview.created_at).toLocaleDateString()} • Created by{" "}
            {preview.user.username}
          </p>
          <h1 className="text-2xl font-bold leading-tight text-gray-900">
            {preview.title}
          </h1>
        </header>

        {preview.thumbnail && (
          <div className="rounded-lg overflow-hidden">
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/storage/${preview.thumbnail}`}
              alt="Hero"
              className="w-full object-cover rounded-lg"
              onError={(e) => (e.currentTarget.style.display = "none")}
              width={800}
              height={450}
              priority
            />
          </div>
        )}

        <article className="prose max-w-none prose-sm sm:prose lg:prose-lg">
          <div dangerouslySetInnerHTML={{ __html: preview.content }} />
        </article>

        {/* Related Articles */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Related Articles
          </h2>

          {related.length === 0 && (
            <div className="text-sm text-gray-500">
              No related articles found.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(related.length > 0 ? related : [preview]).map((article) => (
              <ArticleCard
                key={article.id}
                slug={article.slug}
                image={`${process.env.NEXT_PUBLIC_ASSET_URL}/storage/${article.thumbnail}`}
                date={new Date(article.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                title={article.title}
                excerpt={stripHtml(article.content).slice(0, 100) + "..."}
                tags={[article.category?.name ?? "Uncategorized"]}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
