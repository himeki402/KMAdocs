// DocumentSection.tsx
import { DocumentService } from "@/services/documentService";
import { Document } from "@/types/document";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import DocumentList from "./DocumentList";

interface Category {
    id?: string;
    name?: string;
    slug?: string;
}

interface DocumentSectionProps {
    category: Category;
    onDocumentPress?: (document: Document) => void;
    onMorePress?: (category: Category) => void;
}

const DocumentSection: React.FC<DocumentSectionProps> = ({
    category,
    onDocumentPress,
    onMorePress,
}) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDocuments();
    }, [category.slug]);

    const fetchDocuments = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const response = await DocumentService.getDocumentByCategory({
                page: 1,
                limit: 6,
                slug: category.slug,
            });
            setDocuments(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error("Error fetching documents:", err);
        } finally {
            setLoading(false);
        }
    };

    const renderSectionHeader = () => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">{category.name}</Text>
            <TouchableOpacity
                onPress={() => onMorePress?.(category)}
                style={styles.moreButtonContainer}
            >
                <Text style={styles.moreButton}>Xem thêm</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.section}>
                {renderSectionHeader()}
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007bff" />
                    <Text style={styles.loadingText}>Đang tải tài liệu...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.section}>
                {renderSectionHeader()}
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Gặp lỗi: {error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={fetchDocuments}
                    >
                        <Text style={styles.retryText}>Thử lại</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (documents.length === 0) {
        return (
            <View style={styles.section}>
                {renderSectionHeader()}
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không có tài liệu cho danh mục này</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.section}>
            {renderSectionHeader()}
            <DocumentList
                documents={documents}
                onDocumentPress={onDocumentPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    section: { 
        marginBottom: 24,
        backgroundColor: "transparent",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 16,
        marginTop: 24,
    },
    sectionTitle: { 
        color: "#1a1a1a",
        fontSize: 18, 
        fontWeight: "700", 
        flex: 1 
    },
    moreButtonContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    moreButton: {
        color: "#007bff",
        fontSize: 15,
        fontWeight: "600",
    },
    loadingContainer: {
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        marginHorizontal: 20,
        borderRadius: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    loadingText: { 
        color: "#6c757d", 
        marginTop: 12,
        fontSize: 14,
    },
    errorContainer: {
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#fff5f5",
        marginHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#fed7d7",
    },
    errorText: { 
        color: "#e53e3e", 
        textAlign: "center", 
        marginBottom: 16,
        fontSize: 14,
    },
    retryButton: {
        backgroundColor: "#007bff",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    retryText: { 
        color: "#ffffff",
        fontWeight: "600",
    },
    emptyContainer: {
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        marginHorizontal: 20,
        borderRadius: 12,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    emptyText: { 
        color: "#6c757d",
        fontSize: 14,
        textAlign: "center",
    },
});

export default DocumentSection;