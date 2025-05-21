import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/context/authContext";
import { router } from "expo-router";

export default function LoginScreen() {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) {
        router.replace("/");
        return null;
    }
    return <LoginForm />;
}
