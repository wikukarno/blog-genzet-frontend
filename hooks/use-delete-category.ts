import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "@/services/category-service";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

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

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully!");
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        const message =
          error.response?.data.message ||
          (error.response?.data.errors
            ? Object.values(error.response.data.errors)[0][0]
            : "Failed to delete category.");
        toast.error(message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
};
