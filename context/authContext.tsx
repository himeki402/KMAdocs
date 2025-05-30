import { AuthResult, LoginCredentials, User } from "@/types/auth";
import { TokenStorage } from "@/utils/tokenStorage";
import { router } from "expo-router";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { Alert } from "react-native";
import { login, logout, register } from "../services/authService";
import {
    RegisterFormData,
    validateLogin,
    validateRegister,
} from "../utils/authValidation";

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<AuthResult>;
    register: (
        name: string,
        username: string,
        password: string,
        confirmPassword: string
    ) => Promise<{ success: boolean; errors?: any }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    handleTokenExpired: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const token = await TokenStorage.getToken();
            const userInfo = await TokenStorage.getUserInfo();

            if (token && userInfo) {
                setUser(userInfo);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (
        credentials: LoginCredentials
    ): Promise<AuthResult> => {
        // Validate input
        const validation = validateLogin(credentials);
        if (!validation.success) {
            return { success: false, errors: validation.errors };
        }

        try {
            const response = await login(
                credentials.username,
                credentials.password
            );
            const { data: userInfo } = response;
            setUser(userInfo);
            setIsAuthenticated(true);
            router.push("/");
            return { success: true, user: userInfo };
        } catch (error: any) {
            const errorMessage = error.message || "Đăng nhập thất bại";
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
            setIsLoading(false);
            return { success: false, errors: { form: errorMessage } };
        }
    };

    const handleLogout = async (): Promise<void> => {
        try {
            await logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleTokenExpired = (): void => {
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        checkAuth,
        handleTokenExpired,
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
