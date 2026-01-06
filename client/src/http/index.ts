import axios, { type InternalAxiosRequestConfig } from "axios";

import { handleSessionExpired, refreshToken } from "../store/actionCreators/auth/refreshToken.ts";

const $host = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_URL_SERVER,
});

const $authHost = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_URL_SERVER,
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
