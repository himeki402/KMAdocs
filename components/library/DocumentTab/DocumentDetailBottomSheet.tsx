import { Document } from "@/types/document";
import { convertBytesToMB } from "@/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useImperativeHandle, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DocumentDetailBottomSheetProps {
    onEdit?: (document: Document) => void;
    onRead?: (document: Document) => void;
    onDownload?: (document: Document) => void;
    onShare?: (document: Document) => void;
}

export interface DocumentDetailBottomSheetRef {
    show: (document: Document) => void;
    hide: () => void;
}

const DocumentDetailBottomSheet = forwardRef<
    DocumentDetailBottomSheetRef,
    DocumentDetailBottomSheetProps
>(({ onEdit, onRead, onDownload, onShare }, ref) => {
    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const [currentDocument, setCurrentDocument] =
        React.useState<Document | null>(null);

    const snapPoints = useMemo(() => ["25%", "68%"], []);

    useImperativeHandle(ref, () => ({
        show: (document: Document) => {
            setCurrentDocument(document);
            bottomSheetRef.current?.expand();
        },
        hide: () => {
            bottomSheetRef.current?.close();
        },
    }));

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getAccessTypeText = (accessType: string) => {
        const types = {
            PUBLIC: "Công khai",
            PRIVATE: "Riêng tư",
            GROUP: "Nhóm",
        };
        return types[accessType as keyof typeof types] || "Không xác định";
    };

    const getAccessTypeColor = (accessType: string) => {
        const colors = {
            PUBLIC: "#28a745",
            PRIVATE: "#6c757d",
            GROUP: "#007bff",
        };
        return colors[accessType as keyof typeof colors] || "#6c757d";
    };

    const getTagNames = (tags: { id: string; name: string }[] | undefined) => {
        if (!tags || !Array.isArray(tags)) {
            return [];
        }
        return tags
            .filter(
                (tag) => tag && typeof tag === "object" && tag.id && tag.name
            )
            .map((tag) => tag.name);
    };

    const renderBackdrop = React.useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );

    if (!currentDocument) return null;

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose
            handleIndicatorStyle={styles.indicator}
            backgroundStyle={styles.bottomSheetBackground}
        >
            <BottomSheetScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={2}>
                        {currentDocument.title}
                    </Text>
                    <View
                        style={[
                            styles.accessBadge,
                            {
                                backgroundColor: getAccessTypeColor(
                                    currentDocument.accessType
                                ),
                            },
                        ]}
                    >
                        <Text style={styles.accessText}>
                            {getAccessTypeText(currentDocument.accessType)}
                        </Text>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mô tả</Text>
                    <Text style={styles.description}>
                        {currentDocument.description || "Không có mô tả"}
                    </Text>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <Ionicons
                            name="eye-outline"
                            size={20}
                            color="#6c757d"
                        />
                        <Text style={styles.statText}>
                            {currentDocument.view || 0}
                        </Text>
                    </View>
                    <View style={styles.stat}>
                        <Ionicons
                            name="heart-outline"
                            size={20}
                            color="#28a745"
                        />
                        <Text style={styles.statText}>
                            {currentDocument.likeCount || 0}
                        </Text>
                    </View>
                    <View style={styles.stat}>
                        <Ionicons
                            name="heart-dislike-outline"
                            size={20}
                            color="#dc3545"
                        />
                        <Text style={styles.statText}>
                            {currentDocument.dislikeCount || 0}
                        </Text>
                    </View>
                    <View style={styles.stat}>
                        <Ionicons
                            name="document-outline"
                            size={20}
                            color="#007bff"
                        />
                        <Text style={styles.statText}>
                            {currentDocument.pageCount || 0} trang
                        </Text>
                    </View>
                </View>

                {/* Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Thể loại:</Text>
                        <Text style={styles.detailValue}>
                            {currentDocument.categoryName || "Chưa phân loại"}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Kích thước:</Text>
                        <Text style={styles.detailValue}>
                            {convertBytesToMB(currentDocument.fileSize ?? 0)} MB
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Người tạo:</Text>
                        <Text style={styles.detailValue}>
                            {currentDocument.createdByName || "Không xác định"}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Ngày tạo:</Text>
                        <Text style={styles.detailValue}>
                            {formatDate(currentDocument.created_at)}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Cập nhật:</Text>
                        <Text style={styles.detailValue}>
                            {formatDate(currentDocument.updated_at)}
                        </Text>
                    </View>

                    {/* Tags Section */}
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Thẻ:</Text>
                        <View style={styles.tagsContainer}>
                            {getTagNames(currentDocument.tags).length > 0 ? (
                                getTagNames(currentDocument.tags).map(
                                    (tagName, index) => (
                                        <View
                                            key={`${tagName}-${index}`}
                                            style={styles.tag}
                                        >
                                            <Text style={styles.tagText}>
                                                {tagName}
                                            </Text>
                                        </View>
                                    )
                                )
                            ) : (
                                <Text style={styles.noTagsText}>
                                    Không có thẻ
                                </Text>
                            )}
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.primaryButton]}
                        onPress={() => onRead?.(currentDocument)}
                    >
                        <Ionicons name="book-outline" size={20} color="white" />
                        <Text style={styles.primaryButtonText}>Đọc ngay</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryButton]}
                        onPress={() => onDownload?.(currentDocument)}
                    >
                        <Ionicons
                            name="download-outline"
                            size={20}
                            color="#007bff"
                        />
                        <Text style={styles.secondaryButtonText}>
                            Tải xuống
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryButton]}
                        onPress={() => onEdit?.(currentDocument)}
                    >
                        <Ionicons
                            name="create-outline"
                            size={20}
                            color="#007bff"
                        />
                        <Text style={styles.secondaryButtonText}>
                            Chỉnh sửa
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryButton]}
                        onPress={() => onShare?.(currentDocument)}
                    >
                        <Ionicons
                            name="share-outline"
                            size={20}
                            color="#007bff"
                        />
                        <Text style={styles.secondaryButtonText}>Chia sẻ</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheetScrollView>
        </BottomSheet>
    );
});

DocumentDetailBottomSheet.displayName = "DocumentDetailBottomSheet";

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    indicator: {
        backgroundColor: "#d1d5db",
        width: 40,
    },
    bottomSheetBackground: {
        backgroundColor: "white",
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 10,
        lineHeight: 30,
    },
    accessBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    accessText: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: "#6b7280",
        lineHeight: 24,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
        paddingVertical: 15,
        backgroundColor: "#f9fafb",
        borderRadius: 12,
    },
    stat: {
        alignItems: "center",
        gap: 4,
    },
    statText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#374151",
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
        alignItems: "flex-start",
    },
    detailLabel: {
        fontSize: 14,
        color: "#6b7280",
        flex: 1,
    },
    detailValue: {
        fontSize: 14,
        color: "#374151",
        fontWeight: "500",
        flex: 2,
        textAlign: "right",
    },
    tagsContainer: {
        flex: 2,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        gap: 4,
    },
    tag: {
        backgroundColor: "#e3f2fd",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2196f3",
    },
    tagText: {
        fontSize: 12,
        color: "#1976d2",
        fontWeight: "500",
    },
    noTagsText: {
        fontSize: 14,
        color: "#9ca3af",
        fontStyle: "italic",
    },
    actionButtons: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    primaryButton: {
        backgroundColor: "#007bff",
    },
    secondaryButton: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#007bff",
    },
    primaryButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryButtonText: {
        color: "#007bff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default DocumentDetailBottomSheet;
