import { type RefreshResponse } from '../../../types/auth.ts';

import axios from 'axios';

export const refreshToken = async (): Promise<void> => {
  try {
    const response = await axios.post<RefreshResponse>(
      `${import.meta.env.VITE_URL_SERVER}/user/refresh`,
      {},
      { withCredentials: true }
    );

    localStorage.setItem('accessToken', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response.data.message);
      }
    }
  }
};

export const handleSessionExpired = () => {
  window.dispatchEvent(new CustomEvent('auth:session-expired'));
  localStorage.clear();
};
