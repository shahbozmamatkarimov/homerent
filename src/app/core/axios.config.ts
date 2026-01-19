import axios from 'axios';
import { environment } from '../../environments/environment';

// Create a custom instance
export const axiosInstance = axios.create({
  baseURL: environment.baseUrl, // Set your base API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request Interceptor: e.g., adding an Auth token
axiosInstance.interceptors.request.use(
  (config) => {
    let token;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('auth_token');
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login or handle unauthorized
    }
    return Promise.reject(error);
  }
);
