"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HeroSection from "@/components/articles/hero-section";
import ArticleCard from "@/components/articles/article-card";
import Pagination from "@/components/articles/pagination";
import Footer from "@/components/articles/footer";
import { useArticles } from "@/hooks/use-article";
import { useDebounce } from "use-debounce";
import Cookies from "js-cookie";
import ConfirmDeleteModal from "@/components/layout/confirm-delete-modal";
import { Category } from "@/types/category";

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

export default function ArticlesPageClient({
  categories,
}: {
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined,
  );
  const [username, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => setUsername(json.data.username))
      .catch(() => setUsername(undefined));
  }, []);

  const { data, isLoading } = useArticles(
    debouncedSearch,
    currentPage,
    selectedCategory,
  );

  const articles = data?.data || [];
  const totalPages = data?.last_page || 1;

  const handlePageChange = (page: number) => {
    router.push(`/articles?page=${page}`);
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      setShowLogoutConfirm(false);
      Cookies.remove("token");
      Cookies.remove("role");
      router.replace("/login");
      setLoading(false);
    }, 500);
  };

  return (
    <>
      <HeroSection
        onLogoutClick={() => setShowLogoutConfirm(true)}
        username={username}
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          handlePageChange(1);
        }}
        categoryId={selectedCategory}
        onCategoryChange={(val) => {
          setSelectedCategory(val);
          handlePageChange(1);
        }}
        categories={categories}
      />

      <main className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading articles...</p>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-6">
                Showing: {articles.length} of {data?.total} articles
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard
                    slug={article.slug}
                    key={article.id}
                    image={`${process.env.NEXT_PUBLIC_ASSET_URL}/storage/${article.thumbnail}`}
                    date={new Date(article.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                    title={article.title}
                    excerpt={stripHtml(article.content).slice(0, 100) + "..."}
                    tags={[article.category?.name ?? "Uncategorized"]}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </main>

      <ConfirmDeleteModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        loading={loading}
        title="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
      />
      <Footer />
    </>
  );
}
