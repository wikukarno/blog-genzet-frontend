import Header from "@/components/layout/header";
import { Article } from "@/types/article";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function PreviewArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Unauthorized");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles/show/${params.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch article");
  }

  const json = await res.json();
  const article = json.data;

  const relatedRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles?limit=6`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  const relatedJson = await relatedRes.json();

  let articlesRaw: Article[] = [];
  if (Array.isArray(relatedJson.data)) articlesRaw = relatedJson.data;
  else if (Array.isArray(relatedJson.data?.data))
    articlesRaw = relatedJson.data.data;

  const relatedArticles = articlesRaw
    .filter((item) => item.id !== article.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <Header />

      {/* Main content */}
      <div className="max-w-6xl mx-auto w-full px-4">
        {/* Article Header Info */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            {new Date(article.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            • Created by Admin
          </p>
          <h1 className="text-4xl font-bold mt-2 leading-snug tracking-tight">
            {article.title}
          </h1>
        </div>

        {/* Hero Image */}
        {article.thumbnail && (
          <div className="w-full mt-8 mb-8">
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/storage/${article.thumbnail}`}
              alt={article.title}
              width={1200}
              height={500}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="py-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <article dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="w-full bg-white mt-12 mb-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6">Other articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((item) => (
                <Link
                  key={item.id}
                  href={`/admin/articles/${item.id}/preview`}
                  className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-white flex flex-col"
                >
                  {item.thumbnail && (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_ASSET_URL}/storage/${item.thumbnail}`}
                      alt={item.title}
                      width={400}
                      height={220}
                      className="w-full h-44 object-cover"
                    />
                  )}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <h3 className="text-base font-semibold leading-tight line-clamp-2 mb-3">
                        {item.title}
                      </h3>
                    </div>
                    {item.category?.name && (
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {item.category.name}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-white bg-blue-600 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <Image
            src="/logo-white.svg"
            alt="Logo"
            className="mx-auto h-4 mb-1"
            width={80}
            height={20}
          />
          © 2025 Blog genzet. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
