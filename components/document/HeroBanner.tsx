// HeroBanner.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface HeroBannerProps {
    onSearchPress?: () => void;
    onManagePress?: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
    onSearchPress,
    onManagePress,
}) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#667eea", "#764ba2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    <View style={styles.textContainer}>
                        <Text style={styles.welcomeText}>
                            Chào mừng đến với
                        </Text>
                        <Text style={styles.titleText}>Tài Liệu KMA</Text>
                        <Text style={styles.subtitleText}>
                            Khám phá hàng ngàn tài liệu học tập chất lượng cao
                            từ mọi lĩnh vực
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={onSearchPress}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="search" size={18} color="#667eea" />
                            <Text style={styles.primaryButtonText}>
                                Tìm kiếm tài liệu
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={onManagePress}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.secondaryButtonText}>
                                Quản lý tài liệu
                            </Text>
                            <Ionicons
                                name="arrow-forward"
                                size={16}
                                color="#ffffff"
                            />
                        </TouchableOpacity>
                    </View>            
                </View>

                {/* Decorative elements */}
                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />
                <View style={styles.decorativeCircle3} />
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: height * 0.35,
        marginBottom: 5,
    },
    gradient: {
        flex: 1,
        position: "relative",
        overflow: "hidden",
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 32,
        justifyContent: "space-between",
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
    },
    welcomeText: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 4,
    },
    titleText: {
        color: "#ffffff",
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 8,
        lineHeight: 34,
    },
    subtitleText: {
        color: "rgba(255, 255, 255, 0.9)",
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 10,
    },
    primaryButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 8,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    primaryButtonText: {
        color: "#667eea",
        fontSize: 12,
        fontWeight: "600",
    },
    secondaryButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
        gap: 8,
    },
    secondaryButtonText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "600",
    },
    // Decorative elements
    decorativeCircle1: {
        position: "absolute",
        top: -50,
        right: -50,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    decorativeCircle2: {
        position: "absolute",
        bottom: -30,
        left: -30,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    decorativeCircle3: {
        position: "absolute",
        top: "30%",
        right: -20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
});

export default HeroBanner;
