import { PLACEHOLDER_DOCUMENT_THUMBNAIL } from "@/constants/Placeholder";
import { useAuth } from "@/context/authContext";
import { DocumentService } from "@/services/documentService";
import { Document } from "@/types/document";
import { formatDateToFullOptions } from "@/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { WebView } from "react-native-webview";

const PDF_VIEWER_BASE_URL = "https://mozilla.github.io/pdf.js/web/viewer.html";

export default function DocumentDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const [document, setDocument] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [showPDF, setShowPDF] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

    useEffect(() => {
        const fetchDocument = async () => {
            if (!id) {
                setError("ID tài liệu không hợp lệ");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await DocumentService.getDocumentById(
                    id as string
                );
                const documents: Document[] = response.data;
                const foundDocument = Array.isArray(documents)
                    ? documents[0]
                    : documents;

                if (!foundDocument) {
                    setError("Không tìm thấy tài liệu");
                    return;
                }

                setDocument(foundDocument);
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Có lỗi xảy ra khi tải tài liệu";
                setError(errorMessage);
                console.error("Error fetching document:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [id]);

    const handleDownload = useCallback(async () => {
        if (!document?.fileUrl) {
            Alert.alert("Lỗi", "Không có đường dẫn tài liệu để tải xuống");
            return;
        }

         if (!isAuthenticated) {
            Alert.alert("Lỗi", "Vui lòng đăng nhập để tải tài liệu này.");
            router.push("/(auth)/login");
            return;
        }
        try {
            await Linking.openURL(document.fileUrl);
        } catch (error) {
            console.error("Error opening URL for download:", error);
            Alert.alert(
                "Lỗi",
                "Không thể mở đường dẫn tải xuống. Vui lòng thử lại."
            );
        }
    }, [document]);

    const handleSave = useCallback(() => {
        setIsSaved((prev) => !prev);
        Alert.alert(
            "Lưu tài liệu",
            isSaved
                ? "Đã bỏ lưu tài liệu"
                : "Đã lưu tài liệu vào thư viện của bạn"
        );
        // TODO: Implement actual save functionality
    }, [isSaved]);

    const handleAddToList = useCallback(() => {
        Alert.alert(
            "Thêm vào danh sách",
            "Tính năng thêm vào danh sách sẽ được triển khai trong phiên bản tiếp theo"
        );
    }, []);

    const handleShare = useCallback(async () => {
        if (!document?.fileUrl) {
            Alert.alert("Lỗi", "Không có đường dẫn tài liệu để sao chép");
            return;
        }
        try {
            await Clipboard.setStringAsync(document.fileUrl);
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
    }, [document]);

    const handleReadNow = useCallback(() => {
        if (!document?.fileUrl) {
            Alert.alert("Lỗi", "Không tìm thấy đường dẫn file PDF");
            return;
        }

        setShowPDF(true);
    }, [document?.fileUrl]);

    const handleLike = useCallback(async () => {
        if (!document?.id || isLiked) return;

        if (!isAuthenticated) {
            Alert.alert("Lỗi", "Vui lòng đăng nhập để đánh giá tài liệu này.");
            return;
        }

        try {
            await DocumentService.likeDocument(document.id);
            setDocument((prev) =>
                prev
                    ? {
                          ...prev,
                          likeCount: (prev.likeCount || 0) + 1,
                      }
                    : prev
            );
            setIsLiked(true);
            setIsDisliked(false);
            Alert.alert("Cảm ơn", "Bạn đã đánh giá tài liệu này là hữu ích");
        } catch (error) {
            Alert.alert("Vui lòng đăng nhập để đánh giá tài liệu này.");
        }
    }, [document?.id, isLiked]);

    const handleDislike = useCallback(async () => {
        if (!document?.id || isDisliked) return;
        if (!isAuthenticated) {
            Alert.alert("Lỗi", "Vui lòng đăng nhập để đánh giá tài liệu này.");
            return;
        }

        try {
            await DocumentService.dislikeDocument(document.id);
            setDocument((prev) =>
                prev
                    ? {
                          ...prev,
                          dislikeCount: (prev.dislikeCount || 0) + 1,
                      }
                    : prev
            );
            setIsDisliked(true);
            setIsLiked(false);
            Alert.alert("Cảm ơn", "Cảm ơn bạn đã đánh giá");
        } catch (error) {
            Alert.alert("Lỗi", `Gặp lỗi ${error} khi đánh giá tài liệu này`);
        }
    }, [document?.id, isDisliked]);

    const handleBackPress = useCallback(() => {
        router.back();
    }, [router]);

    const handleClosePDF = useCallback(() => {
        setShowPDF(false);
        setPdfLoading(false);
    }, []);

    const getPDFViewerUrl = (url: string): string => {
        return `${PDF_VIEWER_BASE_URL}?file=${encodeURIComponent(url)}`;
    };

    const handlePDFError = useCallback(() => {
        Alert.alert(
            "Lỗi tải PDF",
            "Không thể tải file PDF. Vui lòng kiểm tra kết nối mạng và thử lại.",
            [{ text: "Quay lại", onPress: handleClosePDF }]
        );
    }, [handleClosePDF]);

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Đang tải tài liệu...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Ionicons
                    name="alert-circle-outline"
                    size={48}
                    color="#e53e3e"
                />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={handleBackPress}
                >
                    <Text style={styles.retryText}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Document not found
    if (!document) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Ionicons name="document-outline" size={48} color="#6c757d" />
                <Text style={styles.errorText}>Không tìm thấy tài liệu</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={handleBackPress}
                >
                    <Text style={styles.retryText}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // PDF Viewer
    if (showPDF) {
        return (
            <View style={styles.container}>
                <PDFHeader
                    title={document.title || "Tài liệu PDF"}
                    onBack={handleClosePDF}
                    onShare={handleShare}
                />
                <WebView
                    source={{ uri: getPDFViewerUrl(document.fileUrl!) }}
                    style={styles.pdfWebView}
                    startInLoadingState={true}
                    onLoadStart={() => setPdfLoading(true)}
                    onLoadEnd={() => setPdfLoading(false)}
                    onError={handlePDFError}
                    renderLoading={() => (
                        <View style={styles.pdfLoadingContainer}>
                            <ActivityIndicator size="large" color="#007bff" />
                            <Text style={styles.pdfLoadingText}>
                                Đang tải PDF...
                            </Text>
                        </View>
                    )}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowsFullscreenVideo={true}
                />
            </View>
        );
    }

    // Main document detail view
    return (
        <View style={styles.container}>
            <DocumentHeader
                title={document.title || "Tiêu đề tài liệu"}
                onBack={handleBackPress}
                onShare={handleShare}
            />

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <DocumentPreview document={document} />

                <TouchableOpacity
                    style={styles.readNowButton}
                    onPress={handleReadNow}
                >
                    <Ionicons name="book-outline" size={20} color="#ffffff" />
                    <Text style={styles.readNowText}>Đọc ngay</Text>
                </TouchableOpacity>

                <ActionButtons
                    onDownload={handleDownload}
                    onSave={handleSave}
                    onAddToList={handleAddToList}
                    isSaved={isSaved}
                />

                <RatingsSection document={document} />

                <DocumentDetails document={document} />

                <DescriptionSection document={document} />

                <UserRatingSection
                    onLike={handleLike}
                    onDislike={handleDislike}
                    isLiked={isLiked}
                    isDisliked={isDisliked}
                />
            </ScrollView>
        </View>
    );
}

const DocumentHeader = ({
    title,
    onBack,
    onShare,
}: {
    title: string;
    onBack: () => void;
    onShare: () => void;
}) => (
    <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
        </Text>
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
            <Ionicons name="share-outline" size={24} color="#1a1a1a" />
        </TouchableOpacity>
    </View>
);

const PDFHeader = ({
    title,
    onBack,
    onShare,
}: {
    title: string;
    onBack: () => void;
    onShare: () => void;
}) => (
    <View style={styles.pdfHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.pdfHeaderTitle} numberOfLines={1}>
            {title}
        </Text>
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
            <Ionicons name="share-outline" size={24} color="#1a1a1a" />
        </TouchableOpacity>
    </View>
);

const DocumentPreview = ({ document }: { document: Document }) => (
    <View style={styles.documentPreview}>
        <View style={styles.thumbnailContainer}>
            <Image
                source={{
                    uri:
                        document.thumbnailUrl || PLACEHOLDER_DOCUMENT_THUMBNAIL,
                }}
                style={styles.thumbnail}
                resizeMode="cover"
            />
            <View style={styles.pdfBadge}>
                <Text style={styles.pdfText}>PDF</Text>
            </View>
        </View>
        <View style={styles.documentInfo}>
            <Text style={styles.documentTitle}>
                {document.title || "Tiêu đề tài liệu chưa được xác định"}
            </Text>
            <Text style={styles.uploadedBy}>
                Được tải lên bởi{" "}
                <Text style={styles.authorName}>
                    {document.createdByName || "Chưa xác định"}
                </Text>
            </Text>
        </View>
    </View>
);

const ActionButtons = ({
    onDownload,
    onSave,
    onAddToList,
    isSaved,
}: {
    onDownload: () => void;
    onSave: () => void;
    onAddToList: () => void;
    isSaved: boolean;
}) => (
    <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={onDownload}>
            <Ionicons name="download-outline" size={24} color="#007bff" />
            <Text style={styles.actionButtonText}>Tải về</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity style={styles.actionButton} onPress={onSave}>
            <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={24}
                color="#007bff"
            />
            <Text style={styles.actionButtonText}>
                {isSaved ? "Đã lưu" : "Lưu"}
            </Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity style={styles.actionButton} onPress={onAddToList}>
            <Ionicons name="list-outline" size={24} color="#007bff" />
            <Text style={styles.actionButtonText}>Thêm vào danh sách</Text>
        </TouchableOpacity>
    </View>
);

const RatingsSection = ({ document }: { document: Document }) => (
    <View style={styles.ratingsSection}>
        <Text style={styles.sectionTitle}>THỐNG KÊ</Text>
        <View style={styles.ratingsRow}>
            <View style={styles.ratingItem}>
                <Ionicons name="thumbs-up" size={16} color="#4CAF50" />
                <Text style={styles.ratingText}>{document.likeCount || 0}</Text>
            </View>
            <View style={styles.ratingItem}>
                <Ionicons name="thumbs-down" size={16} color="#f44336" />
                <Text style={styles.ratingText}>
                    {document.dislikeCount || 0}
                </Text>
            </View>
            <View style={styles.ratingItem}>
                <Ionicons name="eye-outline" size={16} color="#6c757d" />
                <Text style={styles.ratingText}>{document.view || 0}</Text>
            </View>
        </View>
    </View>
);

const DocumentDetails = ({ document }: { document: Document }) => (
    <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>THÔNG TIN CHI TIẾT</Text>

        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>SỐ TRANG</Text>
            <Text style={styles.detailValue}>
                {document.pageCount || "N/A"} trang
            </Text>
        </View>

        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>NGÔN NGỮ</Text>
            <Text style={styles.detailValue}>
                {document.language || "Tiếng Việt"}
            </Text>
        </View>

        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>NGÀY ĐĂNG TẢI</Text>
            <Text style={styles.detailValue}>
                {formatDateToFullOptions(document.created_at) || "N/A"}
            </Text>
        </View>

        <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.detailLabel}>DANH MỤC</Text>
            <Text style={styles.detailValue}>
                {document.categoryName || "Chưa phân loại"}
            </Text>
        </View>
    </View>
);

const DescriptionSection = ({ document }: { document: Document }) => (
    <View style={styles.descriptionSection}>
        <Text style={styles.sectionTitle}>MÔ TẢ</Text>
        <Text style={styles.descriptionText}>
            {document.description || "Chưa có mô tả cho tài liệu này."}
        </Text>
    </View>
);

const UserRatingSection = ({
    onLike,
    onDislike,
    isLiked,
    isDisliked,
}: {
    onLike: () => void;
    onDislike: () => void;
    isLiked: boolean;
    isDisliked: boolean;
}) => (
    <View style={styles.userRatingSection}>
        <Text style={styles.sectionTitle}>ĐÁNH GIÁ TÀI LIỆU</Text>
        <Text style={styles.userRatingSubtitle}>
            Tài liệu này có hữu ích với bạn không?
        </Text>
        <View style={styles.userRatingButtons}>
            <TouchableOpacity
                style={[styles.userRatingButton, isLiked && styles.likedButton]}
                onPress={onLike}
                disabled={isLiked}
            >
                <Ionicons
                    name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
                    size={20}
                    color={isLiked ? "#ffffff" : "#4CAF50"}
                />
                <Text
                    style={[
                        styles.userRatingButtonText,
                        isLiked && styles.likedButtonText,
                    ]}
                >
                    Hữu ích
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.userRatingButton,
                    isDisliked && styles.dislikedButton,
                ]}
                onPress={onDislike}
                disabled={isDisliked}
            >
                <Ionicons
                    name={isDisliked ? "thumbs-down" : "thumbs-down-outline"}
                    size={20}
                    color={isDisliked ? "#ffffff" : "#f44336"}
                />
                <Text
                    style={[
                        styles.userRatingButtonText,
                        isDisliked && styles.dislikedButtonText,
                    ]}
                >
                    Không hữu ích
                </Text>
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#e9ecef",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#f8f9fa",
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: "600",
        color: "#1a1a1a",
        marginLeft: 12,
        marginRight: 12,
    },
    shareButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#f8f9fa",
    },
    content: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    centerContent: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        color: "#6c757d",
        fontSize: 16,
        marginTop: 12,
    },
    errorText: {
        color: "#e53e3e",
        marginBottom: 16,
        marginTop: 12,
        textAlign: "center",
        fontSize: 16,
        lineHeight: 24,
    },
    retryButton: {
        backgroundColor: "#007bff",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    retryText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    documentPreview: {
        padding: 20,
        alignItems: "center",
        backgroundColor: "#ffffff",
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    thumbnailContainer: {
        position: "relative",
        marginBottom: 20,
    },
    thumbnail: {
        width: 120,
        height: 160,
        borderRadius: 12,
        backgroundColor: "#e9ecef",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    pdfBadge: {
        position: "absolute",
        bottom: 8,
        left: 8,
        backgroundColor: "#e53e3e",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        elevation: 2,
    },
    pdfText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },
    documentInfo: {
        alignItems: "center",
    },
    documentTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1a1a1a",
        textAlign: "center",
        marginBottom: 8,
        lineHeight: 28,
    },
    uploadedBy: {
        fontSize: 14,
        color: "#6c757d",
        textAlign: "center",
    },
    authorName: {
        color: "#007bff",
        fontWeight: "600",
    },
    readNowButton: {
        backgroundColor: "#007bff",
        marginHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 16,
        marginBottom: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    readNowText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 8,
    },
    actionButtons: {
        flexDirection: "row",
        marginHorizontal: 16,
        marginBottom: 20,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        paddingVertical: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    actionButton: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
    },
    actionButtonText: {
        color: "#495057",
        fontSize: 12,
        fontWeight: "600",
        marginTop: 4,
    },
    separator: {
        width: 1,
        backgroundColor: "#e9ecef",
        marginVertical: 8,
    },
    ratingsSection: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: "#6c757d",
        marginBottom: 12,
        letterSpacing: 1,
    },
    ratingsRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    ratingItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
    },
    ratingText: {
        color: "#495057",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 6,
    },
    detailsSection: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f8f9fa",
    },
    detailLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#6c757d",
        letterSpacing: 1,
    },
    detailValue: {
        fontSize: 14,
        color: "#495057",
        fontWeight: "600",
        textAlign: "right",
        flex: 1,
        marginLeft: 20,
    },
    descriptionSection: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    descriptionText: {
        color: "#495057",
        fontSize: 14,
        lineHeight: 22,
    },
    userRatingSection: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginHorizontal: 16,
        marginBottom: 30,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    userRatingSubtitle: {
        color: "#6c757d",
        fontSize: 14,
        marginBottom: 16,
    },
    userRatingButtons: {
        flexDirection: "row",
        gap: 12,
    },
    userRatingButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e9ecef",
        backgroundColor: "#ffffff",
    },
    likedButton: {
        backgroundColor: "#4CAF50",
        borderColor: "#4CAF50",
    },
    dislikedButton: {
        backgroundColor: "#f44336",
        borderColor: "#f44336",
    },
    userRatingButtonText: {
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 8,
        color: "#495057",
    },
    likedButtonText: {
        color: "#ffffff",
    },
    dislikedButtonText: {
        color: "#ffffff",
    },
    // PDF Viewer Styles
    pdfHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#e9ecef",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    pdfHeaderTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: "600",
        color: "#1a1a1a",
        marginLeft: 12,
        marginRight: 12,
    },
    pdfWebView: {
        flex: 1,
    },
    pdfLoadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
    },
    pdfLoadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#6c757d",
    },
    pdfActionBar: {
        flexDirection: "row",
        backgroundColor: "#ffffff",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: "#e9ecef",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    pdfActionButton: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
    },
    pdfActionText: {
        color: "#495057",
        fontSize: 12,
        fontWeight: "600",
        marginTop: 4,
    },
});
