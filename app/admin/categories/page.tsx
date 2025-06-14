"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "use-debounce";

import CategoryModal from "@/components/categories/category-modal";
import ConfirmDeleteModal from "@/components/layout/confirm-delete-modal";

import { useCategories } from "@/hooks/use-category";
import { useCreateCategory } from "@/hooks/use-create-category";
import { useUpdateCategory } from "@/hooks/use-update-category";
import { useDeleteCategory } from "@/hooks/use-delete-category";
import { Category } from "@/types/category";
import Pagination from "@/components/articles/pagination";

export default function CategoryListPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const [page, setPage] = useState(1);

  const { data, isLoading } = useCategories(debouncedSearch, page);

  const categories: Category[] = data?.items || [];
  const total: number = data?.total || 0;

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const totalPages = Math.ceil(total / 10);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-lg border bg-white p-4 space-y-4">
          <div className="-mx-4 border-b px-4 pb-2 text-base font-semibold">
            Total Categories : {total}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Input
                placeholder="Search by name"
                className="w-full sm:w-80"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <Button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Category
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-x-auto bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 text-gray-700">
                <TableHead className="p-3">No</TableHead>
                <TableHead className="p-3">Name</TableHead>
                <TableHead className="p-3">Created at</TableHead>
                <TableHead className="p-3">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center p-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center p-4">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="p-3">
                      {((page - 1) * 10) + categories.indexOf(item) + 1}
                    </TableCell>
                    <TableCell className="p-3">{item.name}</TableCell>
                    <TableCell className="p-3">
                      {new Date(item.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="p-3 space-x-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => {
                          setEditingCategory(item);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => {
                          setCategoryToDelete(item);
                          setDeleteModalOpen(true);
                        }}
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>

      <CategoryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        mode={editingCategory ? "edit" : "create"}
        defaultValue={editingCategory?.name || ""}
        onSave={(value) => {
          if (editingCategory) {
            return updateCategory.mutateAsync({
              id: editingCategory.id,
              name: value,
            });
          } else {
            return createCategory.mutateAsync(value);
          }
        }}
      />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        confirmText="Delete"
        cancelText="Cancel"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          if (!categoryToDelete) return;
          deleteCategory.mutate(categoryToDelete.id, {
            onSuccess: () => {
              setDeleteModalOpen(false);
              setCategoryToDelete(null);
            },
          });
        }}
        title={`Are you sure you want to delete this data? "${categoryToDelete?.name}"?`}
      />
    </>
  );
}
