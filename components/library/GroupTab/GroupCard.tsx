import { useAuth } from "@/context/authContext";
import { Group } from "@/types/group";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface GroupCardProps {
    group: Group;
    onPress: () => void;
    onInvite: () => void;
    onShowMenu: () => void;
}

const GroupCard = ({
    group,
    onPress,
    onInvite,
    onShowMenu,
}: GroupCardProps) => {
    const isOwner = group.isAdmin;

    const getMemberCountText = (count: number) => {
        if (count === 0) return "Chưa có thành viên";
        if (count === 1) return "1 thành viên";
        return `${count} thành viên`;
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title} numberOfLines={2}>
                            {group.name}
                        </Text>
                        <View style={styles.badgeContainer}>
                            {isOwner && (
                                <View style={styles.ownerBadge}>
                                    <Text style={styles.ownerBadgeText}>
                                        Quản lý
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={onShowMenu}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={styles.menuIcon}>⋯</Text>
                    </TouchableOpacity>
                </View>

                {/* Description */}
                {group.description && (
                    <Text style={styles.description} numberOfLines={3}>
                        {group.description}
                    </Text>
                )}

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                         <Ionicons name="people" size={18} color="#666" />
                        <Text style={styles.statText}>
                            {getMemberCountText(group.memberCount || 0)}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="document" size={18} color="#666" />
                        <Text style={styles.statText}>
                            {group.documentCount} tài liệu
                        </Text>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.viewButton]}
                        onPress={onPress}
                    >
                        <Text style={styles.viewButtonText}>Xem nhóm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.inviteButton]}
                        onPress={onInvite}
                    >
                        <Text style={styles.inviteButtonText}>Mời</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginVertical: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    titleContainer: {
        flex: 1,
        marginRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 8,
    },
    badgeContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },
    ownerBadge: {
        backgroundColor: "#FEF3C7",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#F59E0B",
    },
    ownerBadgeText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#D97706",
    },
    privacyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
    },
    menuButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    menuIcon: {
        fontSize: 18,
        color: "#6B7280",
        fontWeight: "700",
    },
    description: {
        fontSize: 14,
        color: "#6B7280",
        lineHeight: 20,
        marginBottom: 12,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    statIcon: {
        fontSize: 14,
    },
    statText: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
    },
    actionsContainer: {
        flexDirection: "row",
        gap: 8,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    viewButton: {
        backgroundColor: "#3B82F6",
    },
    inviteButton: {
        backgroundColor: "#F3F4F6",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    viewButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    inviteButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6B7280",
    },
});

export default GroupCard;
