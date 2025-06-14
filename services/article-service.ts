import { apiClient } from "@/lib/api/axios";
import { AxiosError } from "axios";
import { Article, ArticleResponse } from "@/types/article";

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export const getArticles = async (
  search = "",
  page = 1,
  categoryId?: number,
): Promise<ArticleResponse> => {
  const res = await apiClient.get("/articles", {
    params: {
      search,
      page,
      ...(categoryId ? { category_id: categoryId } : {}),
    },
  });

  return res.data.data;
};

export const getArticleByID = async (id: string) => {
  const res = await apiClient.get(`/articles/show/${id}`);
  return res.data.data;
};

export const updateArticle = async ({
  id,
  data,
}: {
  id: string;
  data: FormData;
}) => {
  const response = await apiClient.post(`/articles/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data || response.data;
};

export const getArticleBySlug = async (slug: string): Promise<Article> => {
  const res = await apiClient.get(`/articles/${slug}`);
  return res.data.data;
};


export const createArticle = async (payload: FormData): Promise<Article> => {
  try {
    const res = await apiClient.post("/articles", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data || res.data;
  } catch (error: unknown) {
    if (isAxiosError<ApiErrorResponse>(error)) {
      throw {
        message: error.response?.data.message ?? "Validation failed",
        errors: error.response?.data.errors,
      };
    }

    if (error instanceof Error) {
      throw { message: error.message };
    }

    throw { message: "Unexpected error occurred" };
  }
};

export const deleteArticle = async (id: number): Promise<void> => {
  await apiClient.delete(`/articles/${id}`);
};

function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}
