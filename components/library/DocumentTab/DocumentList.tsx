import { Document } from "@/types/document";
import React from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import DocumentCard from "./DocumentCard";
import LoadingFooter from "../LoadingFooter";
import EmptyState from "../EmptyState";

interface DocumentListProps {
    documents: Document[];
    loading: boolean;
    refreshing: boolean;
    hasMore: boolean;
    page: number;
    onRefresh: () => void;
    onLoadMore: () => void;
    onDocumentRead: (document: Document) => void;
    onDocumentDownload: (document: Document) => void;
    onDocumentShowMenu: (document: Document) => void;
    onDocumentShare: (document: Document) => void;
}

const DocumentList = ({
    documents,
    loading,
    refreshing,
    hasMore,
    page,
    onRefresh,
    onLoadMore,
    onDocumentRead,
    onDocumentDownload,
    onDocumentShowMenu,
    onDocumentShare,
}: DocumentListProps) => {
    const renderDocumentItem = ({ item }: { item: Document }) => (
        <DocumentCard
            document={item}
            onRead={onDocumentRead}
            onDownload={onDocumentDownload}
            onShowMenu={onDocumentShowMenu}
            onShare={onDocumentShare}
        />
    );

    const renderFooter = () => (
        <LoadingFooter 
            visible={loading && page > 1} 
            text="Đang tải thêm..."
        />
    );

    const renderEmptyState = () => (
        <EmptyState
            icon="📄"
            title="Chưa có tài liệu nào"
            description="Bạn chưa có tài liệu nào. Hãy tải lên tài liệu đầu tiên của bạn!"
        />
    );

    return (
        <FlatList
            data={documents}
            renderItem={renderDocumentItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#667eea"]}
                    tintColor="#667eea"
                />
            }
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={!loading ? renderEmptyState : null}
            contentContainerStyle={
                documents.length === 0
                    ? styles.emptyContainer
                    : styles.listContainer
            }
        />
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
    },
    listContainer: {
        paddingBottom: 20,
    },
});

export default DocumentList;