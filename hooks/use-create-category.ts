import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { createCategory } from "@/services/category-service";
import type { Category } from "@/types/category";

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

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, unknown, string>({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully!");
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        const message =
          error.response?.data.message ||
          (error.response?.data.errors
            ? Object.values(error.response.data.errors)[0][0]
            : "Failed to create category.");
        toast.error(message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
};
