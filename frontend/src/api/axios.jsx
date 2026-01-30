import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the session via cookies
        await api.post("/auth/refresh");

        // Retry the original request after successful refresh
        return api(originalRequest);
      } catch (err) {
        /**
         * DEVELOPMENT FIX: Avoid automatic unauthorized redirect
         * We log the error but do NOT force window.location.href to change.
         */
        console.warn("Session expired or refresh failed. Automatic redirect disabled for development.");

        // localStorage.clear(); // Optional: keep or remove based on preference
        // window.location.href = "/login"; // <--- REMOVED TO PREVENT REDIRECT

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
