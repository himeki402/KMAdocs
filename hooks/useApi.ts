import { privateApi, publicApi } from '@/config/api';
import { useAuth } from '@/context/authContext';
import { AxiosRequestConfig, AxiosResponse } from 'axios';


interface ApiMethods {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
}

export const usePublicApi = (): ApiMethods => {
  return {
    get: <T = any>(url: string, config?: AxiosRequestConfig) => 
      publicApi.get<T>(url, config),
    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
      publicApi.post<T>(url, data, config),
    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
      publicApi.put<T>(url, data, config),
    delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
      publicApi.delete<T>(url, config),
  };
};

export const usePrivateApi = (): ApiMethods => {
  const { handleTokenExpired } = useAuth();

  const handleRequest = async <T>(
    requestFn: () => Promise<AxiosResponse<T>>
  ): Promise<AxiosResponse<T>> => {
    try {
      return await requestFn();
    } catch (error: any) {
      if (error.isTokenExpired) {
        handleTokenExpired();
        throw new Error('Session expired. Please login again.');
      }
      throw error;
    }
  };

  return {
    get: <T = any>(url: string, config?: AxiosRequestConfig) => 
      handleRequest(() => privateApi.get<T>(url, config)),
    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
      handleRequest(() => privateApi.post<T>(url, data, config)),
    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
      handleRequest(() => privateApi.put<T>(url, data, config)),
    delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
      handleRequest(() => privateApi.delete<T>(url, config)),
  };
};