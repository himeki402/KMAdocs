import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterScreen() {
    const {
        name,
        setName,
        username,
        setUsername,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        handleRegister,
        errors,
    } = useAuth();
    return (
        <RegisterForm
            name={name}
            setName={setName}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handleRegister={handleRegister}
            errors={errors}
        />
    );
}