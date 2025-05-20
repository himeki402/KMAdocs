import axios, { AxiosResponse } from 'axios';
import { API_URL } from '../constants/api';
import { saveToSecureStore, getFromSecureStore, removeFromSecureStore } from '../utils/secureStore';
import { User, ApiResponse } from '../types';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const register = async (name: string, username: string, password: string): Promise<ApiResponse<User>> => {
  const response: AxiosResponse<ApiResponse<User>> = await api.post('/auth/register', {name, username, password });
  return response.data;
};

export const login = async (username: string, password: string): Promise<ApiResponse<User>> => {
  const response: AxiosResponse<ApiResponse<User>> = await api.post('/auth/login', { username, password });
  console.log('Login response:', response.data, 'Headers:', response.headers);

  const setCookieHeader = response.headers['set-cookie'];
  let token: string | null = null;
  if (setCookieHeader) {
    const cookie = setCookieHeader[0];
    const tokenMatch = cookie.match(/accessToken=([^;]+)/);
    token = tokenMatch ? tokenMatch[1] : null;
  }

  if (token) {
    await saveToSecureStore('accessToken', token);
    await saveToSecureStore('user', JSON.stringify(response.data.data));
  }

  return response.data;
};

export const logout = async (): Promise<void> => {
  await removeFromSecureStore('accessToken');
  await removeFromSecureStore('user');
};

export const makeAuthenticatedRequest = async (endpoint: string): Promise<any> => {
  const token = await getFromSecureStore('accessToken');
  if (!token) {
    throw new Error('No token found');
  }

  const response: AxiosResponse = await api.get(endpoint, {
    headers: {
      Cookie: `accessToken=${token}`,
    },
  });
  return response.data;
};