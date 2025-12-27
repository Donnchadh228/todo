import axios, { type InternalAxiosRequestConfig } from "axios";
import { API_URL } from "../utils/const.ts";

import { handleSessionExpired, refreshToken } from "../store/action-creators/auth/refreshToken.ts";

const $host = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

const $authHost = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

const authInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if (config.headers) {
    config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
  }
  return config;
};

$authHost.interceptors.request.use(authInterceptor);

$authHost.interceptors.response.use(
  config => {
    return config;
  },

  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && error.config && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      try {
        await refreshToken();
        return $authHost.request(originalRequest);
      } catch (error) {
        handleSessionExpired();
        return Promise.reject(error);
      }
    }
    throw error;
  },
);

export { $host, $authHost };
