import { apiClient } from "@/lib/api/axios";
import { LoginPayload, RegisterPayload, AuthResponse } from "@/types/auth";
import { AxiosError } from "axios";

type LaravelValidationErrors = Record<string, string[]>;

type LaravelErrorResponse = {
  message: string;
  errors?: LaravelValidationErrors;
};

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as LaravelErrorResponse;

    if (data.errors) {
      const firstField = Object.values(data.errors)[0];
      if (Array.isArray(firstField)) {
        return firstField[0];
      }
    }

    if (data.message) {
      return data.message;
    }
  }

  return "Something went wrong. Please try again.";
};

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/login", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error));
  }
};

export const register = async (
  data: RegisterPayload,
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      data,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error));
  }
};
