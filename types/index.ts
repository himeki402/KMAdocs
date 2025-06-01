export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
export interface ErrorResponse {
    status: number;
    message: string;
    errors?: Record<string, any>;
}
