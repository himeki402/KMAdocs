import { RegisterFormData } from "@/components/auth/RegisterForm";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { z } from "zod";
import {
    login,
    logout,
    makeAuthenticatedRequest,
    register,
} from "../services/authService";
import { LoginFormData } from "@/components/auth/LoginForm";

const registerSchema = z
    .object({
        name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
        username: z.string().min(4, "Tên đăng nhập phải có ít nhất 4 ký tự"),
        password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

const loginSchema = z.object({
    username: z.string().min(4, "Tên đăng nhập phải có ít nhất 4 ký tự"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const useAuth = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errors, setErrors] = useState<
        Partial<Record<keyof RegisterFormData, string>>
    >({});

    const handleRegister = async (): Promise<void> => {
        setErrors({});
        const data: RegisterFormData = {
            name,
            username,
            password,
            confirmPassword,
        };

        try {
            registerSchema.parse(data);
            const response = await register(name, username, password);
            router.push("/login");
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors;
                setErrors({
                    name: fieldErrors.name?.[0],
                    username: fieldErrors.username?.[0],
                    password: fieldErrors.password?.[0],
                    confirmPassword: fieldErrors.confirmPassword?.[0],
                });
            } else {
                setErrors({ username: error.message || "Đăng ký thất bại" });
            }
        }
    };

    const handleLogin = async (): Promise<void> => {
      setErrors({})
      const data: LoginFormData = { username, password };
        try {
            loginSchema.parse(data);
            const response = await login(username, password);
            router.push("/");
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors;
                setErrors({
                    username: fieldErrors.username?.[0],
                    password: fieldErrors.password?.[0],
                });
            } else {
                setErrors({ username: error.message || "Đăng nhập thất bại" });
            }
        }
    };

    const handleLogout = async (): Promise<void> => {
        try {
            await logout();
            Alert.alert("Success", "Đăng xuất thành công!");
        } catch (error) {
            Alert.alert("Error", "Đăng xuất thất bại");
        }
    };

    const handleAuthenticatedRequest = async (
        endpoint: string
    ): Promise<void> => {
        try {
            const data = await makeAuthenticatedRequest(endpoint);
            Alert.alert("Success", JSON.stringify(data));
        } catch (error) {
            Alert.alert("Error", (error as Error).message || "Request failed");
        }
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        name,
        setName,
        confirmPassword,
        setConfirmPassword,
        handleRegister,
        handleLogin,
        handleLogout,
        handleAuthenticatedRequest,
        errors,
    };
};
