import { api } from "@/config/api";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse, User } from "../types";
import { removeFromSecureStore, saveToSecureStore } from "../utils/secureStore";

export const register = async (
    name: string,
    username: string,
    password: string
): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.post(
        "/auth/register",
        { name, username, password }
    );
    return response.data;
};

export const login = async (
    username: string,
    password: string
): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.post(
        "/auth/login",
        { username, password }
    );

    const setCookieHeader = response.headers["set-cookie"];
    let token: string | null = null;
    if (setCookieHeader) {
        const cookie = setCookieHeader[0];
        const tokenMatch = cookie.match(/accessToken=([^;]+)/);
        token = tokenMatch ? tokenMatch[1] : null;
    }

    if (token) {
        await saveToSecureStore("accessToken", token);
    }

    return response.data;
};

export const logout = async (): Promise<void> => {
    try {
        await api.post("/auth/logout");
    } catch (error) {
        console.error("Logout error:", error);
    } finally {
        await removeFromSecureStore("accessToken");
        await removeFromSecureStore("user");
    }
};

export const getUser = async (): Promise<ApiResponse<User>> => {
    try {
        const response = await api.get("/auth/me");
        if (response.data && response.data.data) {
            await saveToSecureStore("user", JSON.stringify(response.data.data));
        }
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        throw new Error("Không thể lấy thông tin người dùng");
    }
};

export const makeAuthenticatedRequest = async (
    endpoint: string,
    options: AxiosRequestConfig = {}
): Promise<any> => {
    const response: AxiosResponse = await api.get(endpoint, options);
    return response.data;
};

export { api };
