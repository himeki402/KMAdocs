import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Dimensions,
    ScrollView,
    SafeAreaView,
} from "react-native";
import { Group } from "@/types/group";

const { height: screenHeight } = Dimensions.get("window");

export interface GroupDetailBottomSheetRef {
    show: (group: Group) => void;
    hide: () => void;
}

interface GroupDetailBottomSheetProps {
    onView: (group: Group) => void;
    onEdit: (group: Group) => void;
    onInvite: (group: Group) => void;
    onDelete: (group: Group) => void;
    onLeave: (group: Group) => void;
}

const GroupDetailBottomSheet = forwardRef<
    GroupDetailBottomSheetRef,
    GroupDetailBottomSheetProps
>(({ onView, onEdit, onInvite, onDelete, onLeave }, ref) => {
    const [visible, setVisible] = useState(false);
    const [group, setGroup] = useState<Group | null>(null);

    useImperativeHandle(ref, () => ({
        show: (groupData: Group) => {
            setGroup(groupData);
            setVisible(true);
        },
        hide: () => {
            setVisible(false);
            setTimeout(() => setGroup(null), 300);
        },
    }));

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => setGroup(null), 300);
    };

    const handleAction = (action: () => void) => {
        action();
        handleClose();
    };

    if (!group) return null;

    const isOwner = group.isAdmin;

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return "Không xác định";
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={handleClose}
                />
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.handle} />
                        <Text style={styles.title}>Thông tin nhóm</Text>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Group Info */}
                        <View style={styles.infoSection}>
                            <Text style={styles.groupName}>{group.name}</Text>
                            {group.description && (
                                <Text style={styles.groupDescription}>{group.description}</Text>
                            )}                                            

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Vai trò của bạn:</Text>
                                <Text style={styles.detailValue}>
                                    {isOwner ? "Quản trị viên" : "Thành viên"}
                                </Text>
                            </View>

                            {group.memberCount !== undefined && (
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Số thành viên:</Text>
                                    <Text style={styles.detailValue}>{group.memberCount} người</Text>
                                </View>
                            )}

                            {group.created_at && (
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Ngày tạo:</Text>
                                    <Text style={styles.detailValue}>{formatDate(group.created_at)}</Text>
                                </View>
                            )}
                        </View>

                        {/* Actions */}
                        <View style={styles.actionsSection}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleAction(() => onView(group))}
                            >
                                <Text style={styles.actionIcon}>👁️</Text>
                                <Text style={styles.actionText}>Xem nhóm</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleAction(() => onInvite(group))}
                            >
                                <Text style={styles.actionIcon}>📋</Text>
                                <Text style={styles.actionText}>Sao chép liên kết mời</Text>
                            </TouchableOpacity>

                            {isOwner && (
                                <>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => handleAction(() => onEdit(group))}
                                    >
                                        <Text style={styles.actionIcon}>✏️</Text>
                                        <Text style={styles.actionText}>Chỉnh sửa nhóm</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>

                        {/* Danger Zone */}
                        <View style={styles.dangerSection}>
                            {isOwner ? (
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.dangerButton]}
                                    onPress={() => handleAction(() => onDelete(group))}
                                >
                                    <Text style={styles.dangerIcon}>🗑️</Text>
                                    <Text style={styles.dangerText}>Xóa nhóm</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.dangerButton]}
                                    onPress={() => handleAction(() => onLeave(group))}
                                >
                                    <Text style={styles.dangerIcon}>🚪</Text>
                                    <Text style={styles.dangerText}>Rời nhóm</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    backdrop: {
        flex: 1,
    },
    container: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: screenHeight * 0.8,
    },
    header: {
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e9ecef",
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: "#dee2e6",
        borderRadius: 2,
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#212529",
    },
    content: {
        flex: 1,
    },
    infoSection: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f8f9fa",
    },
    groupName: {
        fontSize: 24,
        fontWeight: "700",
        color: "#212529",
        marginBottom: 8,
    },
    groupDescription: {
        fontSize: 16,
        color: "#6c757d",
        lineHeight: 22,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: "#6c757d",
        fontWeight: "500",
    },
    detailValue: {
        fontSize: 14,
        color: "#212529",
        fontWeight: "600",
        textAlign: "right",
        flex: 1,
        marginLeft: 12,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    privateBadge: {
        backgroundColor: "#fff3cd",
    },
    publicBadge: {
        backgroundColor: "#d1ecf1",
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
    },
    privateText: {
        color: "#856404",
    },
    publicText: {
        color: "#0c5460",
    },
    actionsSection: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#f8f9fa",
    },
    actionIcon: {
        fontSize: 20,
        marginRight: 16,
        width: 24,
        textAlign: "center",
    },
    actionText: {
        fontSize: 16,
        color: "#212529",
        fontWeight: "500",
    },
    dangerSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    dangerButton: {
        borderBottomWidth: 0,
    },
    dangerIcon: {
        fontSize: 20,
        marginRight: 16,
        width: 24,
        textAlign: "center",
    },
    dangerText: {
        fontSize: 16,
        color: "#dc3545",
        fontWeight: "500",
    },
});

GroupDetailBottomSheet.displayName = "GroupDetailBottomSheet";

export default GroupDetailBottomSheet;