import { AxiosResponse } from "axios";
import { ApiResponse } from "../types";
import { removeFromSecureStore, saveToSecureStore } from "../utils/secureStore";
import { LoginResponse, User } from "@/types/auth";
import { privateApi, publicApi } from "@/config/api";
import { TokenStorage } from "@/utils/tokenStorage";

export const register = async (
    name: string,
    username: string,
    password: string
): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await publicApi.post(
        "/auth/register",
        { name, username, password }
    );
    return response.data;
};

export const login = async (
    username: string,
    password: string
): Promise<LoginResponse> => {
    const response: AxiosResponse<LoginResponse> = await publicApi.post(
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
        await TokenStorage.saveToken(token);
    }

    return response.data;
};

export const logout = async (): Promise<void> => {
    try {
        await privateApi.post("/auth/logout");
    } catch (error) {
        console.error("Logout error:", error);
    } finally {
        await TokenStorage.removeToken();
    }
};

export const getUser = async (): Promise<ApiResponse<User>> => {
    try {
        const response = await privateApi.get("/auth/me");
        if (response.data && response.data.data) {
            await saveToSecureStore("user", JSON.stringify(response.data.data));
        }
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        throw new Error("Không thể lấy thông tin người dùng");
    }
};
