import { useMutation } from "@tanstack/react-query";
import { updateArticle } from "@/services/article-service";
import { toast } from "react-hot-toast";

export const useUpdateArticle = () => {
  return useMutation({
    mutationFn: updateArticle,
    onError: () => {
      toast.error("Failed to update article");
    },
  });
};
