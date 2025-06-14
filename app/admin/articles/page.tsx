"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useArticles } from "@/hooks/use-article";
import { useCategories } from "@/hooks/use-category";
import { useDebounce } from "use-debounce";
import ClientOnlyDate from "@/components/articles/client-only-date";
import ConfirmDeleteModal from "@/components/layout/confirm-delete-modal";
import { Article } from "@/types/article";
import { useDeleteArticle } from "@/hooks/use-delete-article";
import Pagination from "@/components/articles/pagination";

export default function ArticleListPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined,
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const deleteArticle = useDeleteArticle();

  const router = useRouter();

  const { data: articlesData, isLoading } = useArticles(
    debouncedSearch,
    page,
    selectedCategory,
  );

  const total: number = articlesData?.total || 0;
  const totalPages: number = Math.ceil(total / 10); // asumsi per_page = 10

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories("", 1);

  const goToCreate = () => router.push("/admin/articles/create");

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? undefined : parseInt(value));
    setPage(1);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Filter + Add Section */}
        <div className="rounded-lg border bg-white p-4 space-y-4">
          <div className="-mx-4 border-b px-4 pb-2 text-base font-semibold">
            Total Articles : {articlesData?.total || 0}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Select
                value={
                  selectedCategory !== undefined
                    ? String(selectedCategory)
                    : "all"
                }
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {!isLoadingCategories &&
                    categoriesData?.items.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Search by title"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full sm:w-80"
              />
            </div>

            <Button
              onClick={goToCreate}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Articles
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-x-auto bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 text-gray-700">
                <TableHead className="p-3">Thumbnails</TableHead>
                <TableHead className="p-3">Title</TableHead>
                <TableHead className="p-3">Category</TableHead>
                <TableHead className="p-3">Created at</TableHead>
                <TableHead className="p-3">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="p-4 text-center text-gray-500"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : articlesData?.data.length ? (
                articlesData.data.map((article) => (
                  <TableRow key={article.id} className="border-t">
                    <TableCell className="p-3">
                      <Image
                        src={
                          article.thumbnail
                            ? `${process.env.NEXT_PUBLIC_ASSET_URL}/storage/${article.thumbnail}`
                            : "/placeholder.png"
                        }
                        alt="Thumbnail"
                        className="h-12 w-16 object-cover rounded"
                        width={80}
                        height={60}
                        priority
                      />
                    </TableCell>

                    <TableCell className="p-3">{article.title}</TableCell>
                    <TableCell className="p-3">
                      {article.category?.name || "-"}
                    </TableCell>
                    <TableCell className="p-3">
                      <ClientOnlyDate date={article.created_at} />
                    </TableCell>
                    <TableCell className="p-3 space-x-2">
                      <a
                        href={`/articles/${article.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        Preview
                      </a>
                      <a
                        href={`/admin/articles/${article.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </a>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => {
                          setArticleToDelete(article);
                          setDeleteModalOpen(true);
                        }}
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="p-4 text-center text-gray-500"
                  >
                    No articles found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (!articleToDelete) return;
          deleteArticle.mutate(articleToDelete.id, {
            onSuccess: () => {
              setDeleteModalOpen(false);
              setArticleToDelete(null);
            },
          });
        }}
        title={`Are you sure you want to delete this article? "${articleToDelete?.title}"?`}
      />
    </>
  );
}
