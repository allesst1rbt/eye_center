import axios, {
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "../config";

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

let redirectToLogin: (() => void) | null = null;

export const setRedirectToLogin = (callback: () => void) => {
  redirectToLogin = callback;
};

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");

    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Não autorizado! Redirecionando para login...");
      localStorage.removeItem("token");

      if (redirectToLogin) {
        redirectToLogin();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
