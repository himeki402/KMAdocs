import { Group } from "@/types/group";
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import EmptyState from "../EmptyState";
import GroupCard from "./GroupCard";

interface GroupListProps {
    groups: Group[];
    loading: boolean;
    refreshing: boolean;
    onRefresh: () => void;
    onGroupView: (group: Group) => void;
    onGroupInvite: (group: Group) => void;
    onGroupShowMenu: (group: Group) => void;
    onCreateGroup: () => void;
}

const GroupList = ({
    groups,
    loading,
    refreshing,
    onRefresh,
    onGroupView,
    onGroupInvite,
    onGroupShowMenu,
    onCreateGroup,
}: GroupListProps) => {
    const renderEmpty = () => {
        if (loading && refreshing) return null;

        return (
            <View style={styles.emptyContainer}>
                <EmptyState
                    icon="👥"
                    title="Chưa có nhóm nào"
                    description="Bạn chưa tham gia hoặc tạo nhóm nào. Hãy tạo nhóm đầu tiên của bạn!"
                />
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={onCreateGroup}
                >
                    <Text style={styles.createButtonText}>+ Tạo nhóm mới</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderHeader = () => {
        if (groups.length === 0) return null;
        
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.createButtonSmall}
                    onPress={onCreateGroup}
                >
                    <Text style={styles.createButtonTextSmall}>+ Tạo nhóm mới</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <GroupCard
                    group={item}
                    onPress={() => onGroupView(item)}
                    onInvite={() => onGroupInvite(item)}
                    onShowMenu={() => onGroupShowMenu(item)}
                />
            )}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#3B82F6"]}
                    tintColor="#3B82F6"
                />
            }
            onEndReachedThreshold={0.3}
            ListEmptyComponent={renderEmpty}
            ListHeaderComponent={renderHeader}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
    },
    headerContainer: {
        marginBottom: 16,
        alignItems: "flex-end",
    },
    createButton: {
        backgroundColor: "#3B82F6",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 16,
        shadowColor: "#3B82F6",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    createButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    createButtonSmall: {
        backgroundColor: "#3B82F6",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: "center",
    },
    createButtonTextSmall: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
    },
    separator: {
        height: 12,
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
        gap: 8,
    },
    loadingText: {
        fontSize: 14,
        color: "#6B7280",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },
});

export default GroupList;