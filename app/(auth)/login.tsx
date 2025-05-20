import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
    const { username, setUsername, password, setPassword, handleLogin, errors } =
        useAuth();
    return (
        <LoginForm
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            errors={errors}
        />
    );
}
