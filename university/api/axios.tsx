// import axios from "axios";

// const api = axios.create({
//   // REPLACE THIS with your actual base URL (e.g., https://api.uniedu.com)
//   //   baseURL: "http://localhost:3001/api",
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // This automatically adds the token to every request if it exists in storage
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   // Ensure token is not null, undefined, or the string "null"
//   if (token && token !== "null") {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log("Token expired or invalid, logging out...");

      // Clear all auth data
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("tenantId");
      localStorage.removeItem("universityId");
      localStorage.removeItem("facultyId");
      localStorage.removeItem("departmentId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("u_university_session");
      localStorage.removeItem("loginEmail");

      // Only redirect if not already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
