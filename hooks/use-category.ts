import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/category-service";
import { Category } from "@/types/category";

interface CategoryResponse {
  items: Category[];
  total: number;
}

export const useCategories = (search: string, page: number) => {
  return useQuery<CategoryResponse>({
    queryKey: ["categories", search, page] as const,
    queryFn: () => getCategories(search, page),
    staleTime: Infinity,
  });
};
