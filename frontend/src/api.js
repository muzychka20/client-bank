import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import axios from "axios";

// Function to refresh the access token using the refresh token
const refreshToken = async () => {
  const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN);

  if (refreshTokenValue) {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
        refresh: refreshTokenValue,
      });

      const { access } = response.data;
      // Store the new access token
      localStorage.setItem(ACCESS_TOKEN, access);
      return access;
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Handle error case, like logging out the user
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      window.location.href = "/login";  // Redirect to login page
      throw error; // Throw the error to prevent the original request
    }
  } else {
    // Handle the case where refresh token is not available
    console.error("No refresh token available");
    throw new Error("No refresh token available");
  }
};

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

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

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
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
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // If the error isn't a 401 or if the retry fails, return the error
    return Promise.reject(error);
  }
);

export default api;