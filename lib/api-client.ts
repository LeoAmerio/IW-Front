import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://ucse-iw-2024.onrender.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const data: any = error.response?.data;

    // Handle specific error cases
    if (status === 401) {
      // Unauthorized - maybe redirect to login or clear session
      // But be careful not to cause loops if this happens during login
      console.warn('Unauthorized access');
    }

    const message = data?.error || data?.message || 'Ha ocurrido un error inesperado';
    
    // Don't show toast for 404s or specific handled errors if needed
    if (status !== 404) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);
