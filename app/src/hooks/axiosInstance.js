import axios from "axios";
import { API_URL } from "./constant.js";
import { refreshToken } from "./auth.js";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Single-flight refresh: if several requests get a 401 at the same time, they
// all wait on ONE refresh call instead of each firing their own
// /refresh-token (which rotates the token and caused the request storm/loop).
let refreshPromise = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const shouldRefresh =
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      // never try to refresh the refresh call itself
      !originalRequest.url?.includes("/users/refresh-token");

    if (!shouldRefresh) {
      return Promise.reject(error);
    }

    // Mark this request so it is retried at most once — prevents the loop.
    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshToken().finally(() => {
          refreshPromise = null;
        });
      }
      await refreshPromise;

      // Retry through axiosInstance (NOT plain axios) so baseURL +
      // withCredentials (the auth cookie) are preserved. Retrying with plain
      // axios dropped the credentials, so the retry stayed 401 and looped.
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;
