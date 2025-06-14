
import ArticlesPageClient from "@/components/articles/article-page-client";
import { Category } from "@/types/category";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let categories: Category[] = [];

  if (token) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories?limit=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        },
      );
      const json = await res.json();
      categories = json.data?.items || [];
    } catch {
      categories = [];
    }
  }

  return <ArticlesPageClient categories={categories} />;
}
