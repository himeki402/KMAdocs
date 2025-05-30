

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthFormProps {
  username: string;
  setUsername: (username: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isRegistering: boolean;
  handleSubmit: () => Promise<void>;
  toggleMode: () => void;
  handleAuthenticatedRequest: (endpoint: string) => Promise<void>;
  handleLogout: () => Promise<void>;
}