import { useAuth } from "@/context/authContext";
import { DocumentService } from "@/services/documentService";
import { AccessType, Document, DocumentsResponse } from "@/types/document";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import EmptyState from "../EmptyState";
import LoadingOverlay from "../LoadingOverlay";
import DocumentDetailBottomSheet, {
    DocumentDetailBottomSheetRef,
} from "./DocumentDetailBottomSheet";
import DocumentList from "./DocumentList";
import EditDocumentModal from "./EditDocumentModal";

interface DocumentsTabProps {
    isActive: boolean;
}

interface EditFormData {
    title: string;
    description?: string;
    accessType: AccessType;
    categoryId: string;
    tagIds?: string[];
    groupId?: string;
}

const DocumentsTab = ({ isActive }: DocumentsTabProps) => {
    const { user, isAuthenticated } = useAuth();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalDocuments, setTotalDocuments] = useState(0);
    const { showActionSheetWithOptions } = useActionSheet();
    const detailBottomSheetRef = useRef<DocumentDetailBottomSheetRef>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(
        null
    );

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

    const loadMoreDocuments = () => {
        if (hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchMyDocuments(nextPage);
        }
    };

    const onRefresh = () => {
        setPage(1);
        fetchMyDocuments(1, true);
    };

    useEffect(() => {
        if (isActive && isAuthenticated) {
            fetchMyDocuments(1, true);
        }
    }, [isActive, isAuthenticated]);

    const handleDocumentRead = (document: Document) => {
        router.push({
            pathname: "/document/[id]",
            params: { id: document.id },
        });
    };

    const handleDocumentDownload = (document: Document) => {
        if (!document?.fileUrl) {
            Alert.alert("Lỗi", "Không có đường dẫn tài liệu để tải xuống");
            return;
        }
        try {
            Linking.openURL(document.fileUrl);
        } catch (error) {
            console.error("Error opening URL for download:", error);
            Alert.alert(
                "Lỗi",
                "Không thể mở đường dẫn tải xuống. Vui lòng thử lại."
            );
        }
    };

    const handleDocumentShowMenu = (document: Document) => {
        const options = [
            "Xem thông tin",
            "Chỉnh sửa",
            "Đọc ngay",
            "Tải xuống",
            "Chia sẻ",
            "Hủy",
        ];

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex: 5,
                title: document.title,
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        showDocumentDetails(document);
                        break;
                    case 1:
                        handleEditDocument(document);
                        break;
                    case 2:
                        handleDocumentRead(document);
                        break;
                    case 3:
                        handleDocumentDownload(document);
                        break;
                    case 4:
                        handleDocumentShare(document);
                        break;
                }
            }
        );
    };

    const showDocumentDetails = (document: Document) => {
        detailBottomSheetRef.current?.show(document);
    };

    const handleEditDocument = (document: Document) => {
        setSelectedDocument(document);
        setEditModalVisible(true);
    };

    const handleSubmitEdit = async (data: EditFormData) => {
        if (!selectedDocument) return;

        try {
            setLoading(true);
            await DocumentService.updateDocument(selectedDocument.id, {
                title: data.title,
                description: data.description,
                accessType: data.accessType,
                categoryId: data.categoryId,
                tagIds: data.tagIds,
                groupId: data.groupId,
            });
            Alert.alert("Thành công", "Tài liệu đã được cập nhật!");
            setEditModalVisible(false);
            onRefresh();
        } catch (error: any) {
            Alert.alert("Lỗi", error.message || "Không thể cập nhật tài liệu");
        } finally {
            setLoading(false);
        }
    };

    const handleDocumentShare = (document: Document) => {
        if (!document?.fileUrl) {
            Alert.alert("Lỗi", "Không có đường dẫn tài liệu để chia sẻ");
            return;
        }

        try {
            Clipboard.setStringAsync(document.fileUrl);
            Alert.alert(
                "Thành công",
                "Đường dẫn tài liệu đã được sao chép vào clipboard!"
            );
        } catch (error) {
            console.error("Error copying to clipboard:", error);
            Alert.alert(
                "Lỗi",
                "Không thể sao chép đường dẫn. Vui lòng thử lại."
            );
        }
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

            <DocumentDetailBottomSheet
                ref={detailBottomSheetRef}
                onRead={handleDocumentRead}
                onDownload={handleDocumentDownload}
                onEdit={handleEditDocument}
                onShare={handleDocumentShare}
            />

            <EditDocumentModal
                visible={editModalVisible}
                document={selectedDocument}
                onClose={() => setEditModalVisible(false)}
                onSubmit={handleSubmitEdit}
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
