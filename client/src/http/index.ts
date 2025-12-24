import axios, { type InternalAxiosRequestConfig } from "axios";

const $host = axios.create({
  baseURL: "http://localhost:5000/api/",
});

const $authHost = axios.create({
  baseURL: "http://localhost:5000/api/",
});

const authInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if (config.headers) {
    config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
  }
  return config;
};

$authHost.interceptors.request.use(authInterceptor);
export { $host, $authHost };
