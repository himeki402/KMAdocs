import React from "react";
import { Animated, StyleSheet, View, Text, TouchableOpacity } from "react-native";

import AnalysticsTab from "./AnalyticsTab/AnalyticsTab";
import DocumentsTab from "./DocumentTab/DocumentTab";
import EmptyState from "./EmptyState";
import GroupsTab from "./GroupTab/GroupTab";
import UploadTab from "./UploadTab/UploadTab";
import { useAuth } from "@/context/authContext";
import { router } from "expo-router";


interface TabContentProps {
    activeTab: string;
    opacityAnimation: Animated.Value;
}

const TabContent = ({ activeTab, opacityAnimation }: TabContentProps) => {
    const { isAuthenticated, login } = useAuth();

    const getUnauthenticatedContent = () => {
        switch (activeTab) {
            case "Tài liệu":
                return {
                    icon: "🔒",
                    title: "Đăng nhập để xem tài liệu",
                    text: "Bạn cần đăng nhập để truy cập và quản lý tài liệu của mình",
                };
            case "Nhóm":
                return {
                    icon: "🔒",
                    title: "Đăng nhập để tham gia nhóm",
                    text: "Bạn cần đăng nhập để tham gia và quản lý các nhóm",
                };
            case "Tải lên":
                return {
                    icon: "🔒",
                    title: "Đăng nhập để tải lên tài liệu",
                    text: "Bạn cần đăng nhập để tải lên và chia sẻ tài liệu",
                };
            case "Thống kê":
                return {
                    icon: "🔒",
                    title: "Đăng nhập để xem thống kê",
                    text: "Bạn cần đăng nhập để xem thống kê hoạt động của mình",
                };
            default:
                return {
                    icon: "🔒",
                    title: "Đăng nhập để tiếp tục",
                    text: "Vui lòng đăng nhập để sử dụng đầy đủ tính năng",
                };
        }
    };

    const getAuthenticatedPlaceholderContent = () => {
        switch (activeTab) {
            case "Nhóm":
                return {
                    icon: "👥",
                    title: "Chưa tham gia nhóm nào",
                    text: "Các nhóm bạn tham gia sẽ hiển thị ở đây",
                };
            case "Tải lên":
                return {
                    icon: "⬆️",
                    title: "Chưa có tài liệu tải lên",
                    text: "Tài liệu bạn đã tải lên sẽ hiển thị ở đây",
                };
            case "Thống kê":
                return {
                    icon: "📊",
                    title: "Chưa có dữ liệu thống kê",
                    text: "Thống kê hoạt động của bạn sẽ hiển thị ở đây",
                };
            default:
                return {
                    icon: "📱",
                    title: "Nội dung sẽ hiển thị ở đây",
                    text: "Chọn một tab để xem nội dung",
                };
        }
    };

    const UnauthenticatedState = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
        <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateIcon}>{icon}</Text>
            <Text style={styles.emptyStateTitle}>{title}</Text>
            <Text style={styles.emptyStateDescription}>{description}</Text>
            <TouchableOpacity 
                style={styles.loginButton}
                onPress={() => {
                    router.push('/(auth)/login');
                    console.log('Navigate to login screen');
                }}
            >
                <Text style={styles.loginButtonText}>Đăng nhập ngay</Text>
            </TouchableOpacity>
        </View>
    );

    const renderContent = () => {
        // Nếu chưa đăng nhập, hiển thị màn hình yêu cầu đăng nhập
        if (!isAuthenticated) {
            const content = getUnauthenticatedContent();
            return (
                <UnauthenticatedState
                    icon={content.icon}
                    title={content.title}
                    description={content.text}
                />
            );
        }

        // Nếu đã đăng nhập, hiển thị nội dung bình thường
        switch (activeTab) {
            case "Tài liệu":
                return <DocumentsTab isActive={true} />;
            case "Nhóm":
                return <GroupsTab isActive={true} />;
            case "Thống kê":
                return <AnalysticsTab isActive={true} />;
            case "Tải lên":
                return <UploadTab isActive={true} />;
            default:
                const content = getAuthenticatedPlaceholderContent();
                return (
                    <EmptyState
                        icon={content.icon}
                        title={content.title}
                        description={content.text}
                    />
                );
        }
    };

    return (
        <Animated.View
            style={[styles.container, { opacity: opacityAnimation }]}
        >
            {renderContent()}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        paddingHorizontal: 16,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#2c3e50",
        textAlign: "center",
        marginBottom: 8,
    },
    emptyStateDescription: {
        fontSize: 16,
        color: "#7f8c8d",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 24,
    },
    loginButton: {
        backgroundColor: "#3498db",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});

export default TabContent;