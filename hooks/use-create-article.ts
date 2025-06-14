import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { createArticle } from "@/services/article-service";
import { Article } from "@/types/article";

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

function isAxiosError(error: unknown): error is AxiosError<ApiErrorResponse> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation<Article, unknown, FormData>({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Article created successfully!");
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        const message =
          error.response?.data.message ||
          (error.response?.data.errors
            ? Object.values(error.response.data.errors)[0][0]
            : "Failed to create article.");
        toast.error(message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
};
