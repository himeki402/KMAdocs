import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { Alert } from "react-native";
import { getUser, login, logout, register } from "../services/authService";
import { User } from "../types";
import {
    LoginFormData,
    RegisterFormData,
    validateLogin,
    validateRegister,
} from "../utils/authValidation";

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (
        username: string,
        password: string
    ) => Promise<{ success: boolean; errors?: any }>;
    register: (
        name: string,
        username: string,
        password: string,
        confirmPassword: string
    ) => Promise<{ success: boolean; errors?: any }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    getUser: () => Promise<void>;
    errors: Record<string, string | undefined>;
    clearErrors: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState<Record<string, string | undefined>>(
        {}
    );

    const clearErrors = () => {
        setErrors({});
    };

    // Check if user is authenticated on app start
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const userString = await SecureStore.getItemAsync("user");
            const token = await SecureStore.getItemAsync("accessToken");

            if (userString && token) {
                const userData = JSON.parse(userString) as User;
                setUser(userData);
                setIsAuthenticated(true);
                await fetchUser();
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Error checking authentication:", error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUser = async (): Promise<void> => {
        try {
            const response = await getUser();
            setUser(response.data);
            await SecureStore.setItemAsync(
                "user",
                JSON.stringify(response.data)
            );
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            setErrors({ form: "Không thể lấy thông tin người dùng" });
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const handleLogin = async (
        username: string,
        password: string
    ): Promise<{ success: boolean; errors?: any }> => {
        clearErrors();
        setIsLoading(true);

        // Validate input
        const loginData: LoginFormData = { username, password };
        const validation = validateLogin(loginData);

        if (!validation.success) {
            setErrors(validation.errors);
            setIsLoading(false);
            return { success: false, errors: validation.errors };
        }

        try {
            const response = await login(username, password);
            setUser(response.data);
            setIsAuthenticated(true);
            await fetchUser();
            await SecureStore.setItemAsync(
                "user",
                JSON.stringify(response.data)
            );
            router.push("/");
            return { success: true };
        } catch (error: any) {
            const errorMessage = error.message || "Đăng nhập thất bại";
            setErrors({ form: errorMessage });
            setIsAuthenticated(false);
            setIsLoading(false);
            return { success: false, errors: { form: errorMessage } };
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (
        name: string,
        username: string,
        password: string,
        confirmPassword: string
    ): Promise<{ success: boolean; errors?: any }> => {
        clearErrors();
        setIsLoading(true);

        // Validate input
        const registerData: RegisterFormData = {
            name,
            username,
            password,
            confirmPassword,
        };
        const validation = validateRegister(registerData);

        if (!validation.success) {
            setErrors(validation.errors);
            setIsLoading(false);
            return { success: false, errors: validation.errors };
        }

        try {
            await register(name, username, password);
            setIsLoading(false);
            Alert.alert("Success", "Đăng ký thành công! Vui lòng đăng nhập.");
            router.push("/login");
            return { success: true };
        } catch (error: any) {
            const errorMessage = error.message || "Đăng ký thất bại";
            setErrors({ form: errorMessage });
            setIsLoading(false);
            return { success: false, errors: { form: errorMessage } };
        }
    };

    const handleLogout = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await logout();
            setUser(null);
            setIsAuthenticated(false);
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetUser = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await fetchUser();
        } catch (error) {
            console.error("Error in handleGetUser:", error);
            setErrors({ form: "Không thể lấy thông tin người dùng" });
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        getUser: handleGetUser,
        checkAuth,
        errors,
        clearErrors,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
