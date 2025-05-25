import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});


// Refresh token
export const refreshToken = () => {
  axios
    .post("http://127.0.0.1:8000/api/token/refresh/", {
      refresh: localStorage.getItem(REFRESH_TOKEN),
    })
    .then((response) => {
      const newAccessToken = response.data.access;
      localStorage.setItem(ACCESS_TOKEN, newAccessToken);      
    })
    .catch((error) => {
      console.error("Error updating token:", error);
      localStorage.clear();
    });
};

// Request interceptor to add the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and retry original request
api.interceptors.response.use(
  (response) => response, // If the response is successful, just return it
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Prevent infinite loops

      try {
        // Attempt to refresh the token
        const newAccessToken = await refreshToken();
        // Retry the original request with the new access token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry the original request
      } catch (refreshError) {
        // If token refresh fails, redirect to login
        console.error("Token refresh failed, logging out...");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // If the error isn't a 401 or if the retry fails, return the error
    return Promise.reject(error);
  }
);

export default api;
