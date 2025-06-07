import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CategoryService } from "@/services/categoryService";
import { Category } from "@/types/category";
import useSearchResult from "@/hooks/useSearchResult";

const ExploreScreen = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const { documents: searchResults, loading, error } = useSearchResult({ searchQuery });

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
        setIsSearching(text.length > 0);
    };

    const clearSearch = () => {
        setSearchQuery("");
        setIsSearching(false);
    };

    const renderCategoryItem = ({ item }: { item: Category }) => (
        <TouchableOpacity style={styles.categoryItem}>
            <Text style={styles.categoryText}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderDocumentItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.documentItem}>
            <View style={styles.documentThumbnail}>
                <Ionicons name="document-text" size={32} color="#4A90E2" />
                <View style={styles.pdfBadge}>
                    <Text style={styles.pdfText}>PDF</Text>
                </View>
            </View>
            <View style={styles.documentInfo}>
                <Text style={styles.documentTitle} numberOfLines={2}>{item.title}</Text>
                {item.subtitle ? (
                    <Text style={styles.documentSubtitle}>{item.subtitle}</Text>
                ) : null}
                <Text style={styles.documentAuthor}>{item.author}</Text>
            </View>
            <TouchableOpacity style={styles.bookmarkButton}>
                <Ionicons name="bookmark-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderSearchHeader = () => (
        <View style={styles.searchHeader}>
            <TouchableOpacity onPress={clearSearch} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.searchQuery}>{searchQuery}</Text>
            <TouchableOpacity onPress={clearSearch} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    const renderFilterButtons = () => (
        <View style={styles.filterContainer}>
            <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="options" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterDropdown}>
                <Text style={styles.filterText}>Length</Text>
                <Ionicons name="chevron-down" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterDropdown}>
                <Text style={styles.filterText}>File type</Text>
                <Ionicons name="chevron-down" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterDropdown}>
                <Text style={styles.filterText}>Language</Text>
                <Ionicons name="chevron-down" size={16} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            {isSearching ? (
                <View style={styles.searchContainer}>
                    {renderSearchHeader()}
                    {renderFilterButtons()}
                    {loading && (
                        <Text style={{ color: "#fff", paddingHorizontal: 20 }}>Đang tìm kiếm...</Text>
                    )}
                    {error && (
                        <Text style={{ color: "red", paddingHorizontal: 20 }}>{error}</Text>
                    )}
                    {!loading && !error && (
                        <>
                            <Text style={styles.resultsCount}>
                                {searchResults.length} kết quả phù hợp
                            </Text>
                            <FlatList
                                data={searchResults}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderDocumentItem}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.documentsList}
                            />
                        </>
                    )}
                </View>
            ) : (
                <View style={styles.browseContainer}>
                    <View style={styles.searchInputContainer}>
                        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Title, author, genre, topic"
                            placeholderTextColor="#888"
                            value={searchQuery}
                            onChangeText={handleSearch}
                            onFocus={() => searchQuery.length > 0 && setIsSearching(true)}
                        />
                    </View>
                    <Text style={styles.browseTitle}>Browse all</Text>
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item.id}
                        renderItem={renderCategoryItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesList}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    browseContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
    searchContainer: { flex: 1 },
    searchInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: "#333",
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, color: "#fff", fontSize: 16 },
    searchHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    backButton: { marginRight: 15 },
    searchQuery: { flex: 1, color: "#fff", fontSize: 18, fontWeight: "500" },
    closeButton: { marginLeft: 15 },
    filterContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 15,
        gap: 10,
    },
    filterButton: {
        backgroundColor: "#333",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    filterDropdown: {
        backgroundColor: "#333",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    filterText: { color: "#fff", fontSize: 14 },
    resultsCount: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    browseTitle: { fontSize: 24, fontWeight: "700", color: "#fff", marginBottom: 20 },
    categoriesList: { paddingBottom: 100 },
    categoryItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    categoryText: { fontSize: 18, color: "#fff", fontWeight: "400" },
    documentsList: { paddingBottom: 100 },
    documentItem: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: "center",
    },
    documentThumbnail: {
        width: 60,
        height: 80,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
        position: "relative",
    },
    pdfBadge: {
        position: "absolute",
        bottom: 4,
        right: 4,
        backgroundColor: "#666",
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    pdfText: { color: "#fff", fontSize: 8, fontWeight: "bold" },
    documentInfo: { flex: 1, justifyContent: "center" },
    documentTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 4,
    },
    documentSubtitle: { fontSize: 14, color: "#666", marginBottom: 4 },
    documentAuthor: { fontSize: 12, color: "#888" },
    bookmarkButton: { padding: 8 },
});

export default ExploreScreen;
