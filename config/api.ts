import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_URL } from "../constants/api";
import { getFromSecureStore, removeFromSecureStore } from "../utils/secureStore";

// Tạo instance của axios
const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const token = await getFromSecureStore("accessToken");
            if (token) {
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

// Thêm interceptor để xử lý response và refresh token nếu cần
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            try {
                await removeFromSecureStore("accessToken");
                await removeFromSecureStore("user");
            } catch (logoutError) {
                console.error("Error during logout:", logoutError);
            }
        }
        return Promise.reject(error);
    }
);

export { api };
