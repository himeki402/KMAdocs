import { useAuth } from "@/context/authContext";
import { GroupService } from "@/services/groupService";
import { Group, GroupResponse } from "@/types/group";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import EmptyState from "../EmptyState";
import LoadingOverlay from "../LoadingOverlay";

import CreateGroupModal from "./CreateGroupModal";
import EditGroupModal from "./EditGroupModal";
import GroupList from "./GroupList";

interface GroupsTabProps {
    isActive: boolean;
}

interface EditGroupFormData {
    name: string;
    description?: string;
}

interface CreateGroupFormData {
    name: string;
    description?: string;
}

const GroupsTab = ({ isActive }: GroupsTabProps) => {
    const { isAuthenticated } = useAuth();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { showActionSheetWithOptions } = useActionSheet();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    const fetchMyGroups = async (isRefresh: boolean = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response: GroupResponse = await GroupService.getMygroups();
            
            // Cập nhật state với dữ liệu trả về
            setGroups(response.data || []);
            
        } catch (error: any) {
            Alert.alert("Lỗi", error.message || "Không thể tải danh sách nhóm");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        fetchMyGroups(true);
    };

    useEffect(() => {
        if (isActive && isAuthenticated) {
            fetchMyGroups();
        }
    }, [isActive, isAuthenticated]);

    const handleGroupView = (group: Group) => {
        router.push({
            pathname: "/group/[id]",
            params: { id: group.id },
        });
    };

    const handleGroupInvite = (group: Group) => {
        const inviteLink = `https://yourapp.com/group/join/${group.id}`;
        try {
            Clipboard.setStringAsync(inviteLink);
            Alert.alert(
                "Thành công",
                "Liên kết mời vào nhóm đã được sao chép!"
            );
        } catch (error) {
            console.error("Error copying invite link:", error);
            Alert.alert("Lỗi", "Không thể sao chép liên kết mời");
        }
    };

    const handleGroupShowMenu = (group: Group) => {
        const isOwner = group.isAdmin;
        const options = isOwner
            ? [
                  "Chỉnh sửa",
                  "Xem nhóm",
                  "Mời thành viên",
                  "Xóa nhóm",
                  "Hủy",
              ]
            : [
                  "Xem nhóm",
                  "Mời thành viên",
                  "Rời nhóm",
                  "Hủy",
              ];

        const cancelButtonIndex = options.length - 1;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                destructiveButtonIndex: isOwner ? 5 : 3,
                title: group.name,
            },
            (buttonIndex) => {
                if (isOwner) {
                    switch (buttonIndex) {
                        case 0:
                            handleEditGroup(group);
                            break;
                        case 1:
                            handleGroupView(group);
                            break;
                        case 2:
                            handleGroupInvite(group);
                            break;
                        case 3:
                            handleDeleteGroup(group);
                            break;
                    }
                } else {
                    switch (buttonIndex) {
                        case 0:
                            handleGroupView(group);
                            break;
                        case 1:
                            handleGroupInvite(group);
                            break;
                        case 2:
                            handleLeaveGroup(group);
                            break;
                    }
                }
            }
        );
    };

    const handleEditGroup = (group: Group) => {
        setSelectedGroup(group);
        setEditModalVisible(true);
    };

    const handleCreateGroup = () => {
        setCreateModalVisible(true);
    };

    const handleSubmitEdit = async (data: EditGroupFormData) => {
        if (!selectedGroup) return;

        try {
            setLoading(true);
            await GroupService.updateGroup(selectedGroup.id, {
                name: data.name,
                description: data.description,
            });
            Alert.alert("Thành công", "Nhóm đã được cập nhật!");
            setEditModalVisible(false);
            onRefresh();
        } catch (error: any) {
            Alert.alert("Lỗi", error.message || "Không thể cập nhật nhóm");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitCreate = async (data: CreateGroupFormData) => {
        try {
            setLoading(true);
            await GroupService.createGroup({
                name: data.name,
                description: data.description || "",
            });
            Alert.alert("Thành công", "Nhóm đã được tạo!");
            setCreateModalVisible(false);
            onRefresh();
        } catch (error: any) {
            Alert.alert("Lỗi", error.message || "Không thể tạo nhóm");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGroup = (group: Group) => {
        Alert.alert(
            "Xác nhận xóa",
            `Bạn có chắc chắn muốn xóa nhóm "${group.name}"? Hành động này không thể hoàn tác.`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await GroupService.deleteGroup(group.id);
                            Alert.alert("Thành công", "Nhóm đã được xóa!");
                            onRefresh();
                        } catch (error: any) {
                            Alert.alert(
                                "Lỗi",
                                error.message || "Không thể xóa nhóm"
                            );
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const handleLeaveGroup = (group: Group) => {
        Alert.alert(
            "Xác nhận rời nhóm",
            `Bạn có chắc chắn muốn rời khỏi nhóm "${group.name}"?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Rời nhóm",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            // await GroupService.leaveGroup(group.id);
                            Alert.alert("Thành công", "Bạn đã rời khỏi nhóm!");
                            onRefresh();
                        } catch (error: any) {
                            Alert.alert(
                                "Lỗi",
                                error.message || "Không thể rời nhóm"
                            );
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    if (!isAuthenticated) {
        return (
            <EmptyState
                icon="🔐"
                title="Vui lòng đăng nhập"
                description="Bạn cần đăng nhập để xem nhóm của mình"
            />
        );
    }

    return (
        <View style={styles.container}>

            <GroupList
                groups={groups}
                loading={loading}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onGroupView={handleGroupView}
                onGroupInvite={handleGroupInvite}
                onGroupShowMenu={handleGroupShowMenu}
                onCreateGroup={handleCreateGroup}
            />

            <LoadingOverlay
                visible={loading && !refreshing}
                text="Đang tải nhóm..."
            />

            <EditGroupModal
                visible={editModalVisible}
                group={selectedGroup}
                onClose={() => setEditModalVisible(false)}
                onSubmit={handleSubmitEdit}
            />

            <CreateGroupModal
                visible={createModalVisible}
                onClose={() => setCreateModalVisible(false)}
                onSubmit={handleSubmitCreate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerSection: {
        paddingVertical: 16,
        paddingHorizontal: 4,
        backgroundColor: "transparent",
    },
    groupsCount: {
        fontSize: 16,
        color: "#495057",
        fontWeight: "600",
    },
});

export default GroupsTab;
