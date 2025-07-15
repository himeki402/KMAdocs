import useSearchResult from "@/hooks/useSearchResult";
import { CategoryService } from "@/services/categoryService";
import { Category } from "@/types/category";
import { Document } from "@/types/document";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const ExploreScreen = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [sortBy, setSortBy] = useState("relevance");
    const [showSortModal, setShowSortModal] = useState(false);

    const {
        documents: searchResults,
        loading,
        loadingMore,
        error,
        totalResults,
        hasMore,
        performSearch,
        loadMore,
    } = useSearchResult({ searchQuery, shouldSearch: false, sortBy });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryService.getCategories();
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            setIsSearching(true);
            performSearch();
        }
    };

    const handleDocumentPress = (document: Document) => {
        router.push({
            pathname: "/document/[id]",
            params: { id: document.id }
        });
    };

    const handleSearchKeyPress = () => {
        handleSearchSubmit();
    };

    const handleCategoryPress = (category: any) => {
        router.push({
            pathname: "/category/[slug]",
            params: { slug: category.slug, name: category.name },
        });
    };

    const clearSearch = () => {
        setSearchQuery("");
        setIsSearching(false);
        setSortBy("relevance"); // Reset sort khi clear search
    };

    const handleLoadMore = () => {
        if (hasMore && !loadingMore && !loading) {
            loadMore();
        }
    };

    const handleSortChange = (newSortBy: string) => {
        setSortBy(newSortBy);
        setShowSortModal(false);
        // Sẽ tự động trigger search lại thông qua useEffect trong hook
    };

    const getSortLabel = (sortValue: string) => {
        const sortOptions = {
            relevance: "Độ liên quan",
            newest: "Mới nhất",
            oldest: "Cũ nhất",
            title_asc: "Tên A-Z",
            title_desc: "Tên Z-A",
        };
        return (
            sortOptions[sortValue as keyof typeof sortOptions] || "Độ liên quan"
        );
    };

    const renderCategoryItem = ({ item }: { item: Category }) => (
        <TouchableOpacity
            style={styles.categoryItem}
            activeOpacity={0.7}
            onPress={() => handleCategoryPress(item)}
        >
            <View style={styles.categoryIconContainer}>
                <Ionicons name="folder-outline" size={24} color="#667eea" />
            </View>
            <Text style={styles.categoryText}>{item.name}</Text>
            <Ionicons name="chevron-forward" size={20} color="#6c757d" />
        </TouchableOpacity>
    );

    const renderDocumentItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.documentItem} activeOpacity={0.7} onPress={() => handleDocumentPress(item)}>
            <View style={styles.documentThumbnail}>
                <Ionicons name="document-text" size={32} color="#667eea" />
                <View style={styles.pdfBadge}>
                    <Text style={styles.pdfText}>PDF</Text>
                </View>
            </View>
            <View style={styles.documentInfo}>
                <Text style={styles.documentTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                {item.subtitle ? (
                    <Text style={styles.documentSubtitle}>{item.subtitle}</Text>
                ) : null}
                <Text style={styles.documentAuthor}>{item.createdByName}</Text>
            </View>
            <TouchableOpacity style={styles.bookmarkButton}>
                <Ionicons name="bookmark-outline" size={24} color="#667eea" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        if (!loadingMore) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#667eea" />
                <Text style={styles.footerText}>Đang tải thêm...</Text>
            </View>
        );
    };

    const renderSearchHeader = () => (
        <View style={styles.searchHeader}>
            <TouchableOpacity onPress={clearSearch} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.searchQuery}>{searchQuery}</Text>
            <TouchableOpacity onPress={clearSearch} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#6c757d" />
            </TouchableOpacity>
        </View>
    );

    const renderSortModal = () => {
        if (!showSortModal) return null;

        const sortOptions = [
            { value: "relevance", label: "Độ liên quan", icon: "star" },
            { value: "newest", label: "Mới nhất", icon: "time" },
            { value: "oldest", label: "Cũ nhất", icon: "hourglass" },
            { value: "title_asc", label: "Tên A-Z", icon: "text" },
            { value: "title_desc", label: "Tên Z-A", icon: "text" },
        ];

        return (
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowSortModal(false)}
            >
                <View style={styles.sortModal}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Sắp xếp theo</Text>
                        <TouchableOpacity
                            onPress={() => setShowSortModal(false)}
                        >
                            <Ionicons name="close" size={24} color="#6c757d" />
                        </TouchableOpacity>
                    </View>

                    {sortOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.sortOption,
                                sortBy === option.value &&
                                    styles.sortOptionActive,
                            ]}
                            onPress={() => handleSortChange(option.value)}
                        >
                            <View style={styles.sortOptionLeft}>
                                <Ionicons
                                    name={option.icon as any}
                                    size={20}
                                    color={
                                        sortBy === option.value
                                            ? "#667eea"
                                            : "#6c757d"
                                    }
                                />
                                <Text
                                    style={[
                                        styles.sortOptionText,
                                        sortBy === option.value &&
                                            styles.sortOptionTextActive,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </View>
                            {sortBy === option.value && (
                                <Ionicons
                                    name="checkmark"
                                    size={20}
                                    color="#667eea"
                                />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </TouchableOpacity>
        );
    };

    const renderFilterButtons = () => (
        <View style={styles.filterContainer}>
            <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="options" size={16} color="#667eea" />
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.filterDropdown,
                    sortBy !== "relevance" && styles.filterDropdownActive,
                ]}
                onPress={() => setShowSortModal(true)}
            >
                <Text
                    style={[
                        styles.filterText,
                        sortBy !== "relevance" && styles.filterTextActive,
                    ]}
                >
                    {getSortLabel(sortBy)}
                </Text>
                <Ionicons
                    name="chevron-down"
                    size={16}
                    color={sortBy !== "relevance" ? "#667eea" : "#6c757d"}
                />
            </TouchableOpacity>
        </View>
    );

    const renderResultsHeader = () => (
        <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
                {totalResults} kết quả phù hợp
            </Text>
            {searchResults.length > 0 && (
                <Text style={styles.resultsShowing}>
                    Hiển thị {searchResults.length} / {totalResults}
                </Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            {isSearching ? (
                <View style={styles.searchContainer}>
                    {renderSearchHeader()}
                    {renderFilterButtons()}
                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#667eea" />
                            <Text style={styles.loadingText}>
                                Đang tìm kiếm...
                            </Text>
                        </View>
                    )}
                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}
                    {!loading && !error && (
                        <>
                            {renderResultsHeader()}
                            <FlatList
                                data={searchResults}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderDocumentItem}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.documentsList}
                                onEndReached={handleLoadMore}
                                onEndReachedThreshold={0.1}
                                ListFooterComponent={renderFooter}
                            />
                        </>
                    )}
                </View>
            ) : (
                <View style={styles.browseContainer}>
                    {/* Search Input */}
                    <View style={styles.searchSection}>
                        <View style={styles.searchInputContainer}>
                            <Ionicons
                                name="search"
                                size={20}
                                color="#667eea"
                                style={styles.searchIcon}
                            />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Tiêu đề, mô tả, nội dung..."
                                placeholderTextColor="#6c757d"
                                value={searchQuery}
                                onChangeText={handleSearch}
                                onSubmitEditing={handleSearchKeyPress}
                                returnKeyType="search"
                            />
                            {searchQuery.length > 0 && (
                                <>
                                    <TouchableOpacity
                                        onPress={clearSearch}
                                        style={styles.clearButton}
                                    >
                                        <Ionicons
                                            name="close-circle"
                                            size={20}
                                            color="#6c757d"
                                        />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>

                    {/* Categories */}
                    <View style={styles.categoriesSection}>
                        <Text style={styles.browseTitle}>
                            Duyệt theo danh mục
                        </Text>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item.id}
                            renderItem={renderCategoryItem}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.categoriesList}
                        />
                    </View>
                </View>
            )}
            {renderSortModal()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },

    // Browse Container Styles
    browseContainer: {
        flex: 1,
    },

    // Header Gradient Styles
    headerGradient: {
        paddingTop: 20,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    headerContent: {
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#ffffff",
        marginBottom: 8,
        textAlign: "center",
    },
    headerSubtitle: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.9)",
        textAlign: "center",
        lineHeight: 20,
    },

    // Search Section Styles
    searchSection: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginTop: -15,
    },
    searchInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 99,
        paddingHorizontal: 20,
        paddingVertical: 1,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: "#e9ecef",
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        color: "#1a1a1a",
        fontSize: 16,
        fontWeight: "500",
    },
    searchButton: {
        padding: 4,
        marginRight: 8,
    },
    clearButton: {
        padding: 4,
    },

    // Categories Section Styles
    categoriesSection: {
        flex: 1,
        paddingHorizontal: 20,
    },
    browseTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1a1a1a",
        marginBottom: 16,
        marginTop: 8,
    },
    categoriesList: {
        paddingBottom: 100,
    },
    categoryItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        marginBottom: 8,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: "#f1f3f4",
    },
    categoryIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f8f9ff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    categoryText: {
        fontSize: 16,
        color: "#1a1a1a",
        fontWeight: "500",
        flex: 1,
    },

    // Search Container Styles
    searchContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    searchHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#f1f3f4",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        marginRight: 16,
        padding: 4,
    },
    searchQuery: {
        flex: 1,
        color: "#1a1a1a",
        fontSize: 18,
        fontWeight: "600",
    },
    closeButton: {
        marginLeft: 16,
        padding: 4,
    },

    // Filter Styles
    filterContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#f1f3f4",
    },
    filterButton: {
        backgroundColor: "#f8f9ff",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e1e5f7",
    },
    filterDropdown: {
        backgroundColor: "#f8f9fa",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderWidth: 1,
        borderColor: "#e9ecef",
    },
    filterDropdownActive: {
        backgroundColor: "#f8f9ff",
        borderColor: "#667eea",
    },
    filterText: {
        color: "#495057",
        fontSize: 14,
        fontWeight: "500",
    },
    filterTextActive: {
        color: "#667eea",
        fontWeight: "600",
    },

    // Results Styles
    resultsHeader: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: "#f8f9fa",
        borderBottomWidth: 1,
        borderBottomColor: "#e9ecef",
    },
    resultsCount: {
        color: "#1a1a1a",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    resultsShowing: {
        color: "#6c757d",
        fontSize: 14,
        fontWeight: "400",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },
    loadingText: {
        color: "#6c757d",
        fontSize: 14,
        marginTop: 12,
    },
    errorContainer: {
        padding: 20,
        alignItems: "center",
    },
    errorText: {
        color: "#e53e3e",
        fontSize: 14,
        textAlign: "center",
    },

    // Document List Styles
    documentsList: {
        paddingBottom: 100,
        backgroundColor: "#f8f9fa",
    },
    documentItem: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 16,
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#f1f3f4",
    },
    documentThumbnail: {
        width: 60,
        height: 80,
        backgroundColor: "#f8f9ff",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
        position: "relative",
        borderWidth: 1,
        borderColor: "#e9ecef",
    },
    pdfBadge: {
        position: "absolute",
        bottom: 4,
        right: 4,
        backgroundColor: "#e53e3e",
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    pdfText: {
        color: "#fff",
        fontSize: 8,
        fontWeight: "bold",
    },
    documentInfo: {
        flex: 1,
        justifyContent: "center",
    },
    documentTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: 4,
        lineHeight: 22,
    },
    documentSubtitle: {
        fontSize: 14,
        color: "#6c757d",
        marginBottom: 4,
        lineHeight: 20,
    },
    documentAuthor: {
        fontSize: 12,
        color: "#495057",
        fontWeight: "500",
    },
    bookmarkButton: {
        padding: 8,
    },

    // Footer Loader Styles
    footerLoader: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
        backgroundColor: "#f8f9fa",
    },
    footerText: {
        marginLeft: 10,
        color: "#6c757d",
        fontSize: 14,
    },

    // Sort Modal Styles
    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    sortModal: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 0,
        marginHorizontal: 20,
        maxWidth: 300,
        width: "100%",
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f3f4",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1a1a1a",
    },
    sortOption: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    sortOptionActive: {
        backgroundColor: "#f8f9ff",
    },
    sortOptionLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    sortOptionText: {
        fontSize: 16,
        color: "#1a1a1a",
        marginLeft: 12,
        fontWeight: "400",
    },
    sortOptionTextActive: {
        color: "#667eea",
        fontWeight: "600",
    },
});

export default ExploreScreen;
