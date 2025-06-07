import { useAuth } from "@/context/authContext";
import { UserService } from "@/services/userService";
import { UserProfile } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ProfileScreen = () => {
    const { isAuthenticated, isLoading, logout } = useAuth();

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetUserProfile = async () => {
            if (isAuthenticated) {
                try {
                    const response = await UserService.getUserProfile();
                    setUserProfile(response.data);
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            }
        };
        fetUserProfile();
    }, [isAuthenticated]);

    const user = userProfile;

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0A84FF" />
            </View>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <View style={styles.notAuthenticatedContainer}>
                <Text style={styles.notAuthenticatedText}>
                    Vui lòng đăng nhập để xem thông tin tài khoản
                </Text>
                <Link href="/(auth)/login" style={{ marginTop: 20 }}>
                    Go to Login
                </Link>
                <Link href="/(auth)/register" style={{ marginTop: 20 }}>
                    Go to Register
                </Link>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    {user.avatar ? (
                        <Image
                            source={{ uri: user.avatar }}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {user.name
                                    ? user.name.charAt(0).toUpperCase()
                                    : "U"}
                            </Text>
                        </View>
                    )}
                </View>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userUsername}>@{user.username}</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>

                <View style={styles.infoItem}>
                    <Ionicons name="person-outline" size={24} color="#333" />
                    <Text style={styles.infoText}>Họ tên: {user.name}</Text>
                </View>

                <View style={styles.infoItem}>
                    <Ionicons name="at-outline" size={24} color="#333" />
                    <Text style={styles.infoText}>
                        Tên đăng nhập: {user.username}
                    </Text>
                </View>
                <View style={styles.infoItem}>
                    <Ionicons name="at-outline" size={24} color="#333" />
                    <Text style={styles.infoText}>
                        Trạng thái: {user.status==="PENDING" ? "Đang chờ duyệt" : user.status==="ACTIVE" ? "Đã duyệt" : "Bị từ chối"}
                    </Text>
                </View>
                <View style={styles.infoItem}>
                    <Ionicons name="at-outline" size={24} color="#333" />
                    <Text style={styles.infoText}>
                        Tài liệu đã đăng tải:{" "}
                        {user.documentsUploaded ? user.documentsUploaded : 0}
                    </Text>
                </View>
                <View style={styles.infoItem}>
                    <Ionicons name="mail-outline" size={24} color="#333" />
                    <Text style={styles.infoText}>
                        Email: {user.email ? user.email : "Chưa có"}
                    </Text>
                </View>
                <View style={styles.infoItem}>
                    <Ionicons name="call-outline" size={24} color="#333" />
                    <Text style={styles.infoText}>
                        Phone: {user.phone ? user.phone : "Chưa có"}
                    </Text>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Ionicons name="log-out-outline" size={24} color="#fff" />
                <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    notAuthenticatedContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    notAuthenticatedText: {
        fontSize: 16,
        textAlign: "center",
        color: "#666",
    },
    header: {
        alignItems: "center",
        paddingVertical: 24,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#0A84FF",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarText: {
        fontSize: 32,
        color: "white",
        fontWeight: "bold",
    },
    userName: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 4,
    },
    userUsername: {
        fontSize: 16,
        color: "#666",
    },
    infoSection: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginVertical: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
        color: "#333",
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    infoText: {
        fontSize: 16,
        marginLeft: 12,
        color: "#444",
    },
    logoutButton: {
        backgroundColor: "#FF3B30",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    logoutText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
});

export default ProfileScreen;
