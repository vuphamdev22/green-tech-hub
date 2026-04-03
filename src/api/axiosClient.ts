import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import tokenService from "@/services/tokenService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken();
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetryConfig = AxiosRequestConfig & { _retry?: boolean };
let refreshRequest: Promise<string | null> | null = null;

const shouldSkipRefresh = (url?: string) =>
  !url || url.includes("/auth/login") || url.includes("/auth/refresh");

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkipRefresh(originalRequest.url)
    ) {
      const refreshToken = tokenService.getRefreshToken();
      if (!refreshToken) {
        tokenService.clearTokens();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshRequest) {
        refreshRequest = axios
          .post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
          .then((res) => {
            const data = res.data ?? {};
            const nextAccess = data.accessToken;
            if (!nextAccess) {
              throw new Error("Refresh token request did not return an access token");
            }
            tokenService.setTokens(nextAccess, data.refreshToken);
            return nextAccess;
          })
          .catch((refreshError) => {
            tokenService.clearTokens();
            throw refreshError;
          })
          .finally(() => {
            refreshRequest = null;
          });
      }

      let accessToken: string | null = null;

      try {
        accessToken = await refreshRequest;
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }

      if (accessToken) {
        if (!originalRequest.headers) {
          originalRequest.headers = {};
        }
        (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
