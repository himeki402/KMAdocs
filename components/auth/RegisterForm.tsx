import { useAuth } from "@/context/authContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export const RegisterForm: React.FC = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{
        name?: string;
        username?: string;
        password?: string;
        confirmPassword?: string;
        form?: string;
    }>({});
    const { register, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async () => {
        setErrors({});
        const result = await register(
            name,
            username,
            password,
            confirmPassword
        );
        if (result.success) {
            setName("");
            setUsername("");
            setPassword("");
            setConfirmPassword("");
        } else {
            setErrors(result.errors);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Header with back button */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons
                                name="chevron-back"
                                size={24}
                                color="#000"
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Đăng ký</Text>
                    </View>

                    {/* Logo and app name */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logoBox}>
                            <Ionicons name="layers" size={28} color="#fff" />
                        </View>
                        <Text style={styles.appName}>KMA Document</Text>
                        <Text style={styles.appDescription}>
                            Hệ thống quản lý tài liệu
                        </Text>
                    </View>

                    {/* Register form */}
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Họ và tên</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    errors.name && styles.inputError,
                                ]}
                                placeholder="Nhập họ và tên"
                                value={name}
                                onChangeText={setName}
                            />
                            {errors.name && (
                                <Text style={styles.errorText}>
                                    {errors.name}
                                </Text>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Tên đăng nhập</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    errors.username && styles.inputError,
                                ]}
                                placeholder="Nhập tên đăng nhập"
                                value={username}
                                onChangeText={setUsername}
                            />
                            {errors.username && (
                                <Text style={styles.errorText}>
                                    {errors.username}
                                </Text>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mật khẩu</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={[
                                        styles.passwordInput,
                                        errors.password && styles.inputError,
                                    ]}
                                    placeholder="Nhập mật khẩu"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off" : "eye"}
                                        size={24}
                                        color="#777"
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password && (
                                <Text style={styles.errorText}>
                                    {errors.password}
                                </Text>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Xác nhận mật khẩu</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={[
                                        styles.passwordInput,
                                        errors.confirmPassword &&
                                            styles.inputError,
                                    ]}
                                    placeholder="Nhập lại mật khẩu"
                                    secureTextEntry={!showConfirmPassword}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    <Ionicons
                                        name={
                                            showConfirmPassword
                                                ? "eye-off"
                                                : "eye"
                                        }
                                        size={24}
                                        color="#777"
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.confirmPassword && (
                                <Text style={styles.errorText}>
                                    {errors.confirmPassword}
                                </Text>
                            )}
                        </View>

                        {errors.form && (
                            <Text style={styles.errorText}>{errors.form}</Text>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.registerButton,
                                isLoading && styles.buttonDisabled,
                            ]}
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <Ionicons name="sync" size={24} color="#fff" />
                            )}
                            <Text style={styles.registerButtonText}>
                                Đăng ký
                            </Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>
                                HOẶC TIẾP TỤC VỚI
                            </Text>
                            <View style={styles.divider} />
                        </View>

                        {/* Social login */}
                        <TouchableOpacity style={styles.googleButton}>
                            <View style={styles.googleIconContainer}>
                                <Ionicons
                                    name="logo-google"
                                    size={20}
                                    color="#EA4335"
                                />
                            </View>
                            <Text style={styles.googleButtonText}>
                                Đăng nhập với Google
                            </Text>
                        </TouchableOpacity>

                        {/* Login link */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>
                                Đã có tài khoản?{" "}
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push("/login")}
                            >
                                <Text style={styles.loginLink}>
                                    Đăng nhập ngay
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "500",
        marginLeft: 8,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 24,
    },
    logoBox: {
        width: 60,
        height: 60,
        backgroundColor: "#EF4444",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    inputError: {
        borderColor: "#FF3333",
    },
    errorText: {
        color: "#FF3333",
        fontSize: 12,
        marginTop: 4,
    },
    appName: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 4,
    },
    appDescription: {
        fontSize: 14,
        color: "#666",
    },
    formContainer: {
        width: "100%",
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 8,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    passwordContainer: {
        position: "relative",
    },
    passwordInput: {
        height: 48,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        paddingRight: 50,
    },
    eyeIcon: {
        position: "absolute",
        right: 12,
        top: 12,
    },
    registerButton: {
        height: 48,
        backgroundColor: "#000",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
    },
    buttonDisabled: {
        backgroundColor: "#a0c8ff",
    },
    registerButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#ddd",
    },
    dividerText: {
        paddingHorizontal: 8,
        fontSize: 12,
        color: "#666",
    },
    googleButton: {
        height: 48,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    googleIconContainer: {
        marginRight: 8,
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: "500",
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    loginText: {
        fontSize: 14,
        color: "#333",
    },
    loginLink: {
        fontSize: 14,
        color: "#FF6600",
        fontWeight: "500",
    },
});
