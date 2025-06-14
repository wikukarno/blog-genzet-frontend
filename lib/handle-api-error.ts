import axios from "axios";

export function extractApiValidationError(
  error: unknown,
  field: string,
): string | null {
  if (axios.isAxiosError(error) && error.response?.data?.errors?.[field]?.[0]) {
    return error.response.data.errors[field][0];
  }
  return null;
}
