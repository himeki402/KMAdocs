import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Document } from "@/types/document";
import { DocumentService } from "@/services/documentService";

export default function DocumentDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [document, setDocument] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                setLoading(true);
                const response = await DocumentService.getDocumentById(id as string);
                setDocument(response);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải tài liệu");
                console.error("Error fetching document:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [id]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết tài liệu</Text>
            </View>

            {loading ? (
                <View style={styles.centerContent}>
                    <Text>Đang tải...</Text>
                </View>
            ) : error ? (
                <View style={styles.centerContent}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity 
                        style={styles.retryButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.retryText}>Quay lại</Text>
                    </TouchableOpacity>
                </View>
            ) : document ? (
                <View style={styles.documentContainer}>
                    <Text style={styles.documentTitle}>{document.title}</Text>
                    {/* Hiển thị các thông tin khác của tài liệu */}
                </View>
            ) : (
                <View style={styles.centerContent}>
                    <Text>Không tìm thấy tài liệu</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 16,
    },
    centerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "#e53e3e",
        marginBottom: 16,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#0a7ea4",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryText: {
        color: "#fff",
        fontWeight: "600",
    },
    documentContainer: {
        padding: 16,
    },
    documentTitle: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 16,
    },
});