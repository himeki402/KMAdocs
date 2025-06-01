import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { DocumentService } from "@/services/documentService";
import { Document, DocumentsResponse } from "@/types/document";
import {
    Animated,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from "react-native";

interface TabContentProps {
    activeTab: string;
    opacityAnimation: Animated.Value;
}

const TabContent = ({ activeTab, opacityAnimation }: TabContentProps) => {
    const { user, isAuthenticated } = useAuth();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalDocuments, setTotalDocuments] = useState(0);

    // Fetch tài liệu của người dùng
    const fetchMyDocuments = async (pageNumber: number = 1, isRefresh: boolean = false) => {
        if (loading && !isRefresh) return;
        
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response: DocumentsResponse = await DocumentService.getMyDocuments({
                page: pageNumber,
                limit: 10,
                sortBy: "createdAt",
                sortOrder: "DESC"
            });

            if (isRefresh || pageNumber === 1) {
                setDocuments(response.data || []);
            } else {
                setDocuments(prev => [...prev, ...(response.data || [])]);
            }

            setTotalDocuments(response.meta.total || 0);
            setHasMore((response.data?.length || 0) === 10 && (response.data?.length || 0) < (response.meta.total || 0));

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
        if (activeTab === "Tài liệu" && isAuthenticated) {
            fetchMyDocuments(1, true);
        }
    }, [activeTab, isAuthenticated]);

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Format date
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Render document item
    const renderDocumentItem = ({ item }: { item: Document }) => (
        <TouchableOpacity style={styles.documentItem}>
            <View style={styles.documentHeader}>
                <Text style={styles.documentTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <View style={styles.documentMeta}>
                    <Text style={styles.documentMetaText}>
                        {formatFileSize(item.fileSize || 0)}
                    </Text>
                    <Text style={styles.documentMetaText}>•</Text>
                    <Text style={styles.documentMetaText}>
                        {formatDate(item.created_at)}
                    </Text>
                </View>
            </View>
            
            {item.description && (
                <Text style={styles.documentDescription} numberOfLines={2}>
                    {item.description}
                </Text>
            )}
            
            <View style={styles.documentFooter}>
                <View style={styles.documentStats}>
                    <Text style={styles.statText}>
                        ❤️ {item.likeCount || 0}
                    </Text>
                    <Text style={styles.statText}>
                        👁️ {item.view || 0}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    // Render footer for loading more
    const renderFooter = () => {
        if (!loading || page === 1) return null;
        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color="#667eea" />
                <Text style={styles.loadingText}>Đang tải thêm...</Text>
            </View>
        );
    };

    // Render empty state
    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
                📄 Chưa có tài liệu nào
            </Text>
            <Text style={styles.emptyStateText}>
                Bạn chưa có tài liệu nào. Hãy tải lên tài liệu đầu tiên của bạn!
            </Text>
        </View>
    );

    return (
        <Animated.View style={[styles.content, { opacity: opacityAnimation }]}>
            <Text style={styles.contentTitle}>{activeTab}</Text>
            <View style={styles.tabContent}>
                {activeTab === "Tài liệu" && isAuthenticated ? (
                    <View style={styles.documentsContainer}>
                        {totalDocuments > 0 && (
                            <Text style={styles.documentsCount}>
                                Tổng cộng: {totalDocuments} tài liệu
                            </Text>
                        )}
                        
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
                                />
                            }
                            onEndReached={loadMoreDocuments}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={renderFooter}
                            ListEmptyComponent={!loading ? renderEmptyState : null}
                            contentContainerStyle={
                                documents.length === 0 ? styles.emptyContainer : undefined
                            }
                        />
                        
                        {loading && page === 1 && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#667eea" />
                                <Text style={styles.loadingText}>
                                    Đang tải tài liệu...
                                </Text>
                            </View>
                        )}
                    </View>
                ) : activeTab === "Tài liệu" && !isAuthenticated ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateTitle}>
                            🔐 Vui lòng đăng nhập
                        </Text>
                        <Text style={styles.emptyStateText}>
                            Bạn cần đăng nhập để xem tài liệu của mình
                        </Text>
                    </View>
                ) : (
                    <>
                        {activeTab === "Nhóm" && (
                            <Text style={styles.placeholderText}>
                                Các nhóm bạn tham gia sẽ hiển thị ở đây
                            </Text>
                        )}
                        {activeTab === "Tải lên" && (
                            <Text style={styles.placeholderText}>
                                Tài liệu bạn đã tải lên sẽ hiển thị ở đây
                            </Text>
                        )}
                        {activeTab === "Thống kê" && (
                            <Text style={styles.placeholderText}>
                                Thống kê hoạt động của bạn sẽ hiển thị ở đây
                            </Text>
                        )}
                    </>
                )}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    contentTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111",
        marginBottom: 16,
    },
    userInfo: {
        backgroundColor: "#f8f9ff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 3,
        borderLeftColor: "#667eea",
    },
    userName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111",
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: "#666",
    },
    tabContent: {
        flex: 1,
    },
    documentsContainer: {
        flex: 1,
    },
    documentsCount: {
        fontSize: 14,
        color: "#666",
        marginBottom: 12,
        fontWeight: "500",
    },
    documentItem: {
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#f0f0f0",
    },
    documentHeader: {
        marginBottom: 8,
    },
    documentTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111",
        marginBottom: 4,
    },
    documentMeta: {
        flexDirection: "row",
        alignItems: "center",
    },
    documentMetaText: {
        fontSize: 12,
        color: "#888",
        marginRight: 8,
    },
    documentDescription: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
        marginBottom: 12,
    },
    documentFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    documentStats: {
        flexDirection: "row",
        alignItems: "center",
    },
    statText: {
        fontSize: 12,
        color: "#888",
        marginRight: 16,
    },
    categoryBadge: {
        backgroundColor: "#667eea",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 10,
        color: "#fff",
        fontWeight: "500",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },
    loadingFooter: {
        paddingVertical: 20,
        alignItems: "center",
    },
    loadingText: {
        fontSize: 14,
        color: "#888",
        marginTop: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
        textAlign: "center",
    },
    emptyStateText: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
        lineHeight: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
    },
    placeholderText: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        fontStyle: "italic",
        flex: 1,
        textAlignVertical: "center",
    },
});

export default TabContent;