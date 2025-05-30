import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { TokenStorage } from "@/utils/tokenStorage";
import { ApiError } from "@/types/auth";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL 

export const publicApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const privateApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

privateApi.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const token = await TokenStorage.getToken();
            if (token && config.headers) {
                config.headers.set("Cookie", `accessToken=${token}`);
                // config.headers.set('Authorization', `Bearer ${token}`);
            }
            return config;
        } catch (error) {
            console.error("Error getting token from SecureStore:", error);
            return config;
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

privateApi.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<ApiError> => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await TokenStorage.removeToken();
      const apiError: ApiError = {
        message: (error.response.data as any)?.message || 'Unauthorized',
        statusCode: 401,
        isTokenExpired: true
      };
      return Promise.reject(apiError);
    }
    
    const apiError: ApiError = {
      message: (error.response?.data as any)?.message || error.message || 'Network error',
      statusCode: error.response?.status || 500
    };
    return Promise.reject(apiError);
  }
);

publicApi.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError<any>): Promise<ApiError> => {
    const apiError: ApiError = {
      message: (error.response?.data as any)?.message || error.message || 'Network error',
      statusCode: error.response?.status || 500
    };
    return Promise.reject(apiError);
  }
);
