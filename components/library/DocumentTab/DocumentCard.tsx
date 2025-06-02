import { PLACEHOLDER_DOCUMENT_THUMBNAIL } from "@/constants/Placeholder";
import { Document } from "@/types/document";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DocumentCardProps {
    document: Document;
    onRead: (document: Document) => void;
    onDownload: (document: Document) => void;
    onShowMenu: (document: Document) => void;
    onShare: (document: Document) => void;
}

const DocumentCard = ({
    document,
    onRead,
    onDownload,
    onShowMenu,
    onShare,
}: DocumentCardProps) => {
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const getFileType = (document: Document): string => {
        if (document.mimeType) {
            if (document.mimeType.includes("pdf")) return "PDF";
            if (document.mimeType.includes("word")) return "DOC";
            if (document.mimeType.includes("excel")) return "XLS";
            if (document.mimeType.includes("powerpoint")) return "PPT";
        }
        return "FILE";
    };

    const getBadgeColor = (accessType: string): string => {
        switch (accessType) {
            case "PUBLIC":
                return "#28a745";
            case "GROUP":
                return "#007bff";
            case "PRIVATE":
            default:
                return "#6c757d";
        }
    };

    return (
        <View style={styles.documentCard}>
            {/* Header với thumbnail và thông tin cơ bản */}
            <View style={styles.cardHeader}>
                <View style={styles.thumbnailContainer}>
                    <View style={styles.thumbnail}>
                        {document.thumbnailUrl ? (
                            <Image
                                source={{
                                    uri:
                                        document.thumbnailUrl ||
                                        PLACEHOLDER_DOCUMENT_THUMBNAIL,
                                }}
                                style={styles.thumbnail}
                                placeholder={PLACEHOLDER_DOCUMENT_THUMBNAIL}
                            />
                        ) : (
                            <View
                                style={[
                                    styles.thumbnail,
                                    styles.defaultThumbnail,
                                ]}
                            >
                                <Ionicons
                                    name="document-text-outline"
                                    size={40}
                                    color="#6c757d"
                                />
                            </View>
                        )}
                    </View>
                    <View style={styles.fileTypeBadge}>
                        <Text style={styles.fileTypeText}>
                            {getFileType(document)}
                        </Text>
                    </View>
                </View>

                <View style={styles.headerInfo}>
                    <Text style={styles.documentTitle} numberOfLines={2}>
                        {document.title}
                    </Text>
                    <View style={styles.metaRow}>
                        <View
                            style={[
                                styles.statusBadge,
                                {
                                    backgroundColor: getBadgeColor(
                                        document.accessType
                                    ),
                                },
                            ]}
                        >
                            <Text style={styles.statusText}>
                                {document.accessType === "PUBLIC"
                                    ? "Công khai"
                                    : document.accessType === "GROUP"
                                    ? "Nhóm"
                                    : "Riêng tư"}
                            </Text>
                        </View>
                        <Text style={styles.dateText}>
                            {formatDate(document.created_at)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Description */}
            {document.description && (
                <Text style={styles.description} numberOfLines={4}>
                    {document.description}
                </Text>
            )}

            {/* Tags và thông tin bổ sung */}
            <View style={styles.tagsContainer}>
                <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>
                        {document.categoryName || "Chưa phân loại"}
                    </Text>
                </View>
                <Text style={styles.pageCount}>{document.pageCount} trang</Text>
            </View>

            {/* Action buttons */}
            <View style={styles.actionSection}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => onRead(document)}
                >
                    <Text style={styles.primaryButtonText}>Đọc ngay</Text>
                </TouchableOpacity>

                <View style={styles.secondaryActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onDownload(document)}
                    >
                        <Ionicons
                            name="download-outline"
                            size={24}
                            color="#007bff"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onShare(document)}
                    >
                        <Ionicons
                            name="share-outline"
                            size={24}
                            color="#007bff"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onShowMenu(document)}
                    >
                        <Ionicons
                            name="list-outline"
                            size={24}
                            color="#007bff"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    documentCard: {
        padding: 16,
        marginBottom: 12,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    thumbnailContainer: {
        alignItems: "center",
        marginRight: 12,
    },
    thumbnail: {
        width: 60,
        height: 80,
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#e9ecef",
    },
    defaultThumbnail: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e9ecef",
    },
    fileTypeBadge: {
        backgroundColor: "#e53e3e",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginTop: 6,
        minWidth: 40,
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    fileTypeText: {
        fontSize: 10,
        color: "#ffffff",
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    headerInfo: {
        flex: 1,
        paddingTop: 2,
    },
    documentTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: 10,
        lineHeight: 22,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingRight: 4,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        alignSelf: "flex-start",
    },
    statusText: {
        fontSize: 11,
        color: "#ffffff",
        fontWeight: "600",
    },
    dateText: {
        fontSize: 12,
        color: "#6c757d",
        fontWeight: "500",
        textAlign: "right",
    },
    description: {
        fontSize: 14,
        color: "#495057",
        lineHeight: 20,
        marginBottom: 12,
        paddingHorizontal: 2,
    },
    tagsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        paddingHorizontal: 2,
    },
    categoryTag: {
        backgroundColor: "#007bff",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 11,
        color: "#ffffff",
        fontWeight: "600",
    },
    pageCount: {
        fontSize: 12,
        color: "#6c757d",
        fontWeight: "500",
    },
    actionSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 2,
    },
    primaryButton: {
        backgroundColor: "#007bff",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginRight: 12,
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    primaryButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#ffffff",
    },
    secondaryActions: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionButton: {
        width: 40,
        height: 40,
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
        borderWidth: 1,
        borderColor: "#e9ecef",
    },
});

export default DocumentCard;
