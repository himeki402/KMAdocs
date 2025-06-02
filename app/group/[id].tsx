import { PLACEHOLDER_DOCUMENT_THUMBNAIL } from "@/constants/Placeholder";
import { useAuth } from "@/context/authContext";
import { GroupService } from "@/services/groupService";
import { Document, Group } from "@/types/group";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import EditGroupModal from "../../components/library/GroupTab/EditGroupModal";
import * as Clipboard from 'expo-clipboard';

interface EditGroupFormData {
    name: string;
    description?: string;
}

export default function GroupDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"documents" | "members">(
        "documents"
    );
    const [editModalVisible, setEditModalVisible] = useState(false);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            if (!id) {
                setError("ID nhóm không hợp lệ");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Giả định API endpoint để lấy chi tiết nhóm
                // Cần thêm API endpoint này vào GroupService
                const response = await GroupService.getGroupById(id as string);
                setGroup(response.data);
            } catch (error: any) {
                setError(error.message || "Không thể tải thông tin nhóm");
            } finally {
                setLoading(false);
            }
        };

        fetchGroupDetails();
    }, [id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const handleInviteMember = () => {
        if (!group) return;

        const inviteLink = `https://yourapp.com/group/join/${group.id}`;
        try {
            Clipboard.setStringAsync(inviteLink);
            Alert.alert(
                "Thành công",
                "Liên kết mời vào nhóm đã được sao chép!"
            );
        } catch (error) {
            Alert.alert("Lỗi", "Không thể sao chép liên kết");
        }
    };

    const handleEditGroup = () => {
        if (!group) return;
        setEditModalVisible(true);
    };

    const handleSubmitEdit = async (data: EditGroupFormData) => {
        if (!group) return;

        try {
            setLoading(true);
            await GroupService.updateGroup(group.id, data);

            // Cập nhật thông tin nhóm sau khi chỉnh sửa
            const response = await GroupService.getGroupById(group.id);
            setGroup(response.data);

            setEditModalVisible(false);
            Alert.alert("Thành công", "Đã cập nhật thông tin nhóm");
        } catch (error: any) {
            Alert.alert(
                "Lỗi",
                error.message || "Không thể cập nhật thông tin nhóm"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGroup = () => {
        if (!group) return;

        Alert.alert(
            "Xác nhận xóa",
            `Bạn có chắc chắn muốn xóa nhóm "${group.name}"? Hành động này không thể hoàn tác.`,
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await GroupService.deleteGroup(group.id);
                            Alert.alert("Thành công", "Đã xóa nhóm");
                            router.back();
                        } catch (error: any) {
                            Alert.alert(
                                "Lỗi",
                                error.message || "Không thể xóa nhóm"
                            );
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const handleViewDocument = (document: Document) => {
        router.push({
            pathname: "/document/[id]",
            params: { id: document.id },
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>
                    Đang tải thông tin nhóm...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!group) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    Không tìm thấy thông tin nhóm
                </Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {group.name}
                </Text>
                <View style={styles.headerRight}>
                    {group.isAdmin && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleEditGroup}
                        >
                            <Ionicons name="pencil" size={24} color="#0066cc" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView style={styles.content}>
                {/* Group Info */}
                <View style={styles.infoSection}>
                    <View style={styles.infoHeader}>
                        <Text style={styles.sectionTitle}>Thông tin nhóm</Text>
                        {group.isAdmin && (
                            <View style={styles.adminBadge}>
                                <Text style={styles.adminBadgeText}>
                                    Quản lý
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.groupName}>{group.name}</Text>

                    {group.description && (
                        <Text style={styles.description}>
                            {group.description}
                        </Text>
                    )}

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="people" size={18} color="#666" />
                            <Text style={styles.statText}>
                                {group.memberCount} thành viên
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="document" size={18} color="#666" />
                            <Text style={styles.statText}>
                                {group.documentCount} tài liệu
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="calendar" size={18} color="#666" />
                            <Text style={styles.statText}>
                                Tạo ngày {formatDate(group.created_at)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.adminInfo}>
                        <Text style={styles.adminLabel}>Người quản lý:</Text>
                        <Text style={styles.adminName}>
                            {group.groupAdmin?.name || "Không xác định"}
                        </Text>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.inviteBtn]}
                            onPress={handleInviteMember}
                        >
                            <Ionicons
                                name="person-add"
                                size={18}
                                color="#fff"
                            />
                            <Text style={styles.actionBtnText}>
                                Mời thành viên
                            </Text>
                        </TouchableOpacity>

                        {group.isAdmin && (
                            <TouchableOpacity
                                style={[styles.actionBtn, styles.deleteBtn]}
                                onPress={handleDeleteGroup}
                            >
                                <Ionicons name="trash" size={18} color="#fff" />
                                <Text style={styles.actionBtnText}>
                                    Xóa nhóm
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === "documents" && styles.activeTab,
                        ]}
                        onPress={() => setActiveTab("documents")}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "documents" &&
                                    styles.activeTabText,
                            ]}
                        >
                            Tài liệu ({group.documentCount})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === "members" && styles.activeTab,
                        ]}
                        onPress={() => setActiveTab("members")}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "members" && styles.activeTabText,
                            ]}
                        >
                            Thành viên ({group.memberCount})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                {activeTab === "documents" ? (
                    <View style={styles.tabContent}>
                        {!group.documents || group.documents.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons
                                    name="document-outline"
                                    size={48}
                                    color="#ccc"
                                />
                                <Text style={styles.emptyStateTitle}>
                                    Chưa có tài liệu nào
                                </Text>
                                <Text style={styles.emptyStateDesc}>
                                    Nhóm này chưa có tài liệu nào. Hãy thêm tài
                                    liệu vào nhóm!
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={group.documents}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.documentItem}
                                        onPress={() => handleViewDocument(item)}
                                    >
                                        <Image
                                            source={{
                                                uri: PLACEHOLDER_DOCUMENT_THUMBNAIL,
                                            }}
                                            style={styles.documentThumb}
                                        />
                                        <View style={styles.documentInfo}>
                                            <Text
                                                style={styles.documentTitle}
                                                numberOfLines={2}
                                            >
                                                {item.title}
                                            </Text>
                                            <Text style={styles.documentMeta}>
                                                {formatDate(item.created_at)} •{" "}
                                                {(
                                                    item.fileSize /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                                MB
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                scrollEnabled={false}
                            />
                        )}
                    </View>
                ) : (
                    <View style={styles.tabContent}>
                        {!group.members || group.members.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons
                                    name="people-outline"
                                    size={48}
                                    color="#ccc"
                                />
                                <Text style={styles.emptyStateTitle}>
                                    Chưa có thành viên nào
                                </Text>
                                <Text style={styles.emptyStateDesc}>
                                    Nhóm này chưa có thành viên nào ngoài bạn.
                                    Hãy mời thêm thành viên!
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={group.members}
                                keyExtractor={(item) => item.user_id}
                                renderItem={({ item }) => (
                                    <View style={styles.memberItem}>
                                        <View style={styles.memberAvatar}>
                                            <Text style={styles.memberInitial}>
                                                {item.user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </Text>
                                        </View>
                                        <View style={styles.memberInfo}>
                                            <Text style={styles.memberName}>
                                                {item.user.name}
                                                {item.user_id ===
                                                    group.groupAdmin?.id && (
                                                    <Text
                                                        style={
                                                            styles.memberRole
                                                        }
                                                    >
                                                        {" "}
                                                        (Quản lý)
                                                    </Text>
                                                )}
                                            </Text>
                                            <Text style={styles.memberEmail}>
                                                {item.user.email}
                                            </Text>
                                        </View>
                                        <Text style={styles.memberJoinDate}>
                                            {formatDate(item.joined_at)}
                                        </Text>
                                    </View>
                                )}
                                scrollEnabled={false}
                            />
                        )}
                    </View>
                )}
            </ScrollView>

            {/* Edit Group Modal */}
            <EditGroupModal
                visible={editModalVisible}
                group={group}
                onClose={() => setEditModalVisible(false)}
                onSubmit={handleSubmitEdit}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 30,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: "#ff3b30",
        textAlign: "center",
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: "#0066cc",
        fontSize: 16,
        fontWeight: "500",
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginHorizontal: 10,
    },
    headerRight: {
        width: 40,
        alignItems: "flex-end",
    },
    actionButton: {
        padding: 8,
    },
    content: {
        flex: 1,
    },
    infoSection: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    infoHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 14,
        color: "#666",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    adminBadge: {
        backgroundColor: "#007aff",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    adminBadgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "500",
    },
    groupName: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: "#444",
        marginBottom: 16,
        lineHeight: 22,
    },
    statsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 16,
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 16,
        marginBottom: 8,
    },
    statText: {
        fontSize: 14,
        color: "#666",
        marginLeft: 4,
    },
    adminInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    adminLabel: {
        fontSize: 14,
        color: "#666",
        marginRight: 4,
    },
    adminName: {
        fontSize: 14,
        fontWeight: "500",
    },
    actionButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    actionBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 4,
    },
    inviteBtn: {
        backgroundColor: "#007aff",
    },
    deleteBtn: {
        backgroundColor: "#ff3b30",
    },
    actionBtnText: {
        color: "#fff",
        fontWeight: "500",
        marginLeft: 6,
    },
    tabContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: "#007aff",
    },
    tabText: {
        fontSize: 16,
        color: "#666",
    },
    activeTabText: {
        color: "#007aff",
        fontWeight: "500",
    },
    tabContent: {
        padding: 16,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 12,
        marginBottom: 8,
    },
    emptyStateDesc: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
    },
    documentItem: {
        flexDirection: "row",
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
        marginBottom: 12,
    },
    documentThumb: {
        width: 60,
        height: 60,
        borderRadius: 4,
        backgroundColor: "#eee",
    },
    documentInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "center",
    },
    documentTitle: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4,
    },
    documentMeta: {
        fontSize: 12,
        color: "#666",
    },
    memberItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    memberAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#007aff",
        alignItems: "center",
        justifyContent: "center",
    },
    memberInitial: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    memberInfo: {
        flex: 1,
        marginLeft: 12,
    },
    memberName: {
        fontSize: 16,
        fontWeight: "500",
    },
    memberRole: {
        fontSize: 14,
        color: "#007aff",
        fontWeight: "normal",
    },
    memberEmail: {
        fontSize: 14,
        color: "#666",
    },
    memberJoinDate: {
        fontSize: 12,
        color: "#999",
    },
});
