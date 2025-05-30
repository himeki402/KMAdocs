export interface RegisterFormProps {
    name: string;
    setName: (name: string) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    handleRegister: () => Promise<void>;
}

export interface User {
    id: string;
    email?: string;
    name: string;
    username: string;
    role: string;
    status: string;
}

export interface ApiError {
    message: string;
    statusCode: number;
    isTokenExpired?: boolean;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResult {
    success: boolean;
    user?: User;
    errors?: any;
}

export interface LoginResponse {
    statusCode: number;
    message: string
    data: User;
}
