import { apiClient } from "@/lib/api/axios";
import { Category } from "@/types/category";

export const getAllCategories = async (): Promise<Category[]> => {
  const res = await getCategories("", 1, 100);
  return res.items;
};

export const getCategories = async (
  search = "",
  page = 1,
  limit = 10,
): Promise<{ items: Category[]; total: number }> => {
  const res = await apiClient.get("/categories", {
    params: { search, page, limit },
  });

  const items = res.data.data.items || [];
  const total = res.data.data.pagination?.total || 0;

  return { items, total };
};



export const createCategory = async (name: string): Promise<Category> => {
  const res = await apiClient.post("/categories", { name });
  return res.data.data || res.data;
};

export const updateCategory = async (
  id: number,
  name: string,
): Promise<Category> => {
  const res = await apiClient.put(`/categories/${id}`, { name });
  return res.data.data || res.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};

