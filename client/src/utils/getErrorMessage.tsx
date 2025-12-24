import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response?.data?.errors?.[0]?.msg) {
    return error.response.data.errors[0].msg;
  }
  return error instanceof Error ? error.message : "Неизвестная ошибка";
};
