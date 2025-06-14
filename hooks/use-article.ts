import { useQuery } from "@tanstack/react-query";
import { getArticles } from "@/services/article-service";

import { ArticleResponse } from "@/types/article";

export const useArticles = (
  search: string,
  page: number,
  categoryId?: number,
) => {
  return useQuery<ArticleResponse>({
    queryKey: ["articles", search, page, categoryId],
    queryFn: () => getArticles(search, page, categoryId),
    staleTime: Infinity,
  });
};
