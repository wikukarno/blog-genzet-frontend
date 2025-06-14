import { getArticleByID } from "@/services/article-service";
import { Article } from "@/types/article";
import { useQuery } from "@tanstack/react-query";

export const useArticleDetail = (id: string) => {
  return useQuery<Article>({
    queryKey: ["article", id],
    queryFn: () => getArticleByID(id),
    enabled: !!id,
  });
};
