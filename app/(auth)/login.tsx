import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/context/authContext";
import { router } from "expo-router";
import { useEffect } from "react";

export default function LoginScreen() {
    const { isAuthenticated } = useAuth();
    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/");
        }
    }, [isAuthenticated]);

    if (isAuthenticated) {
        return null;
    }
    return <LoginForm />;
}
