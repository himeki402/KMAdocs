import React from "react";
import { Animated, StyleSheet } from "react-native";

import EmptyState from "./EmptyState";
import DocumentsTab from "./DocumentTab/DocumentTab";
import GroupsTab from "./GroupTab/GroupTab";

interface TabContentProps {
    activeTab: string;
    opacityAnimation: Animated.Value;
}

const TabContent = ({ activeTab, opacityAnimation }: TabContentProps) => {
    const getPlaceholderContent = () => {
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

    const renderContent = () => {
        switch (activeTab) {
            case "Tài liệu":
                return <DocumentsTab isActive={true} />;
            
            case "Nhóm":
                return <GroupsTab isActive={true} />;
            
            default:
                const content = getPlaceholderContent();
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
});

export default TabContent;