import axios from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response?.data) {
    const response = error.response.data;
    return response.errors[0] ? response.errors[0].msg : response.message;
  }
  return error instanceof Error ? error.message : 'Неизвестная ошибка';
};
