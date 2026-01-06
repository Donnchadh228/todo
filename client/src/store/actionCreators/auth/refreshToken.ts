import { type AuthResponse } from "../../../types/auth.ts";

import axios from "axios";

export const refreshToken = async (): Promise<void> => {
  const tokenId = localStorage.getItem("tokenId");
  if (!tokenId) {
    throw new Error("Нет идентификатора токена");
  }

  const response = await axios.post<AuthResponse>(
    `${import.meta.env.VITE_URL_SERVER}/user/refresh`,
    { tokenId },
    { withCredentials: true },
  );

  localStorage.setItem("tokenId", response.data.tokenId.toString());
  localStorage.setItem("accessToken", response.data.accessToken);
};

export const handleSessionExpired = () => {
  window.dispatchEvent(new CustomEvent("auth:session-expired"));
  localStorage.clear();
};
