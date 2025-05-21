import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/context/authContext";
import { router } from "expo-router";

export default function RegisterScreen() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        router.replace("/");
        return null;
    }
    return <RegisterForm />;
}
