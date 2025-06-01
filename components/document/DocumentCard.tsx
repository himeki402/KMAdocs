// DocumentCard.tsx
import { PLACEHOLDER_DOCUMENT_THUMBNAIL } from "@/constants/Placeholder";
import { Document } from "@/types/document";
import { convertBytesToMB } from "@/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const documentDefaultThumbnail = require("@/assets/images/default-document.png");
const { width } = Dimensions.get("window");

interface DocumentCardProps {
    document: Document;
    onPress?: (document: Document) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onPress }) => {
    const getFileTypeFromMimeType = (mimeType: string): string => {
        if (mimeType.includes("pdf")) return "PDF";
        if (mimeType.includes("doc")) return "DOC";
        if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
            return "XLS";
        if (
            mimeType.includes("powerpoint") ||
            mimeType.includes("presentation")
        )
            return "PPT";
        return "FILE";
    };

    const getFileTypeColor = (mimeType: string): string => {
        if (mimeType.includes("pdf")) return "#e53e3e";
        if (mimeType.includes("doc")) return "#3182ce";
        if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
            return "#38a169";
        if (
            mimeType.includes("powerpoint") ||
            mimeType.includes("presentation")
        )
            return "#dd6b20";
        return "#6b46c1";
    };

    return (
        <TouchableOpacity
            style={styles.documentCard}
            onPress={() => onPress?.(document)}
            activeOpacity={0.8}
        >
            <View style={styles.thumbnailContainer}>
                {document.thumbnailUrl ? (
                    <Image
                        source={{ uri: document.thumbnailUrl || PLACEHOLDER_DOCUMENT_THUMBNAIL }}
                        style={styles.thumbnail}
                        placeholder={PLACEHOLDER_DOCUMENT_THUMBNAIL}
                    />
                ) : (
                    <View style={[styles.thumbnail, styles.defaultThumbnail]}>
                        <Ionicons
                            name="document-text-outline"
                            size={40}
                            color="#6c757d"
                        />
                    </View>
                )}

                <View
                    style={[
                        styles.fileBadge,
                        {
                            backgroundColor: getFileTypeColor(
                                document.mimeType
                            ),
                        },
                    ]}
                >
                    <Text style={styles.fileText}>
                        {getFileTypeFromMimeType(document.mimeType)}
                    </Text>
                </View>

                {document.fileSize && (
                    <View style={styles.fileSizeBadge}>
                        <Text style={styles.fileSizeText}>
                            {convertBytesToMB(document.fileSize) || "N/A"} MB
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.documentInfo}>
                <Text style={styles.documentLabel}>Tài liệu</Text>
                <Text style={styles.documentTitle} numberOfLines={2}>
                    {document.title || "Untitled Document"}
                </Text>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Ionicons
                            name="eye-outline"
                            size={12}
                            color="#6c757d"
                        />
                        <Text style={styles.statText}>
                            {document.view?.toString() || "0"}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons
                            name="heart-outline"
                            size={12}
                            color="#6c757d"
                        />
                        <Text style={styles.statText}>
                            {String(document.likeCount || 0)}
                        </Text>
                    </View>
                </View>
                <View style={styles.authorContainer}>
                    <Text style={styles.uploadedBy}>TẢI LÊN BỞI</Text>
                    <View style={styles.authorRow}>
                        <View style={styles.authorAvatar}>
                            <Text style={styles.authorInitial}>
                                {(document.createdByName || "U")
                                    .charAt(0)
                                    .toUpperCase()}
                            </Text>
                        </View>
                        <Text style={styles.authorName} numberOfLines={1}>
                            {document.createdByName || "Unknown"}
                        </Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.bookmarkButton}>
                <Ionicons name="bookmark-outline" size={18} color="#6c757d" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    documentCard: {
        width: width * 0.42,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginVertical: 4,
    },
    thumbnailContainer: {
        position: "relative",
        height: 160,
    },
    thumbnail: {
        width: "100%",
        height: "100%",
        backgroundColor: "#f8f9fa",
    },
    defaultThumbnail: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e9ecef",
    },
    fileBadge: {
        position: "absolute",
        bottom: 8,
        right: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    fileText: {
        color: "#ffffff",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    fileSizeBadge: {
        position: "absolute",
        top: 8,
        left: 8,
        backgroundColor: "rgba(0,0,0,0.7)",
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
    },
    fileSizeText: {
        color: "#ffffff",
        fontSize: 10,
        fontWeight: "500",
    },
    documentInfo: {
        padding: 12,
        flex: 1,
    },
    documentLabel: {
        color: "#6c757d",
        fontSize: 11,
        fontWeight: "600",
        marginBottom: 4,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    documentTitle: {
        color: "#1a1a1a",
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 8,
        lineHeight: 20,
    },
    statsContainer: {
        flexDirection: "row",
        marginBottom: 12,
        gap: 12,
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
    },
    statText: {
        color: "#6c757d",
        fontSize: 11,
        fontWeight: "500",
    },
    authorContainer: {
        marginTop: "auto",
    },
    uploadedBy: {
        color: "#6c757d",
        fontSize: 9,
        fontWeight: "700",
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    authorRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    authorAvatar: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: "#007bff",
        marginRight: 6,
        justifyContent: "center",
        alignItems: "center",
    },
    authorInitial: {
        color: "#ffffff",
        fontSize: 9,
        fontWeight: "700",
    },
    authorName: {
        color: "#495057",
        fontSize: 12,
        flex: 1,
        fontWeight: "500",
    },
    bookmarkButton: {
        position: "absolute",
        top: 8,
        right: 8,
        padding: 6,
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 6,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});

export default DocumentCard;
