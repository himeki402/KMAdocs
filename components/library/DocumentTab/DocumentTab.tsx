import { useAuth } from "@/context/authContext";
import { DocumentService } from "@/services/documentService";
import { Document, DocumentsResponse } from "@/types/document";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import EmptyState from "../EmptyState";
import LoadingOverlay from "../LoadingOverlay";
import DocumentList from "./DocumentList";
import { router } from "expo-router";
import Clipboard from "expo-clipboard";

interface DocumentsTabProps {
    isActive: boolean;
}

const DocumentsTab = ({ isActive }: DocumentsTabProps) => {
    const { user, isAuthenticated } = useAuth();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalDocuments, setTotalDocuments] = useState(0);

    const fetchMyDocuments = async (
        pageNumber: number = 1,
        isRefresh: boolean = false
    ) => {
        if (loading && !isRefresh) return;

        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response: DocumentsResponse =
                await DocumentService.getMyDocuments({
                    page: pageNumber,
                    limit: 10,
                    sortBy: "createdAt",
                    sortOrder: "DESC",
                });

            if (isRefresh || pageNumber === 1) {
                setDocuments(response.data || []);
            } else {
                setDocuments((prev) => [...prev, ...(response.data || [])]);
            }

            setTotalDocuments(response.meta.total || 0);
            setHasMore(
                (response.data?.length || 0) === 10 &&
                    (response.data?.length || 0) < (response.meta.total || 0)
            );
        } catch (error: any) {
            Alert.alert(
                "Lỗi",
                error.message || "Không thể tải danh sách tài liệu"
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Load more documents
    const loadMoreDocuments = () => {
        if (hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchMyDocuments(nextPage);
        }
    };

    // Refresh documents
    const onRefresh = () => {
        setPage(1);
        fetchMyDocuments(1, true);
    };

    // Fetch documents when tab becomes active and user is authenticated
    useEffect(() => {
        if (isActive && isAuthenticated) {
            fetchMyDocuments(1, true);
        }
    }, [isActive, isAuthenticated]);

    // Document action handlers
    const handleDocumentRead = (document: Document) => {
        router.push({
            pathname: "/document/[id]",
            params: { id: document.id },
        });
    };

    const handleDocumentDownload = (document: Document) => {
        // TODO: Implement document download functionality
        console.log("Download document:", document.id);
    };

    const handleDocumentShowMenu = (document: Document) => {
        // TODO: Implement document menu functionality
        console.log("Show menu for document:", document.id);
    };

    const handleDocumentShare = (document: Document) => {
        
    };

    if (!isAuthenticated) {
        return (
            <EmptyState
                icon="🔐"
                title="Vui lòng đăng nhập"
                description="Bạn cần đăng nhập để xem tài liệu của mình"
            />
        );
    }

    return (
        <View style={styles.container}>
            {/* Header with document count */}
            {totalDocuments > 0 && (
                <View style={styles.headerSection}>
                    <Text style={styles.documentsCount}>
                        Tổng cộng: {totalDocuments} tài liệu
                    </Text>
                </View>
            )}

            <DocumentList
                documents={documents}
                loading={loading}
                refreshing={refreshing}
                hasMore={hasMore}
                page={page}
                onRefresh={onRefresh}
                onLoadMore={loadMoreDocuments}
                onDocumentRead={handleDocumentRead}
                onDocumentDownload={handleDocumentDownload}
                onDocumentShowMenu={handleDocumentShowMenu}
                onDocumentShare={handleDocumentShare}
            />

            <LoadingOverlay
                visible={loading && page === 1}
                text="Đang tải tài liệu..."
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
    documentsCount: {
        fontSize: 16,
        color: "#495057",
        fontWeight: "600",
    },
});

export default DocumentsTab;
