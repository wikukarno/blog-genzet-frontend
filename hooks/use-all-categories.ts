import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/services/category-service";
import { Category } from "@/types/category";

export const useAllCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories", "all"],
    queryFn: getAllCategories,
    staleTime: Infinity,
  });
};
