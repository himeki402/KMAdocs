// HomeScreen.tsx
import { Document } from "@/types/document";
import { StyleSheet, View, ScrollView } from "react-native";
import { useState } from "react";
import DocumentSection from "@/components/document/DocumentSection";

const HomeScreen = () => {
    const [categories] = useState([
        { id: "1", name: "Sách Giáo Trình", slug: "Sach-giao-trinh" },
        { id: "2", name: "Tài liệu tham khảo", slug: "Tai-lieu-tham-khao" },
        { id: "3", name: "Tài liệu Chuyên ngành", slug: "tai-lieu-chuyen-nganh" },
        { id: "4", name: "Tài liệu ngoại ngữ", slug: "Tai-lieu-ngoai-ngu" },
    ]);

    const handleDocumentPress = (document: Document) => {
        console.log("Document pressed:", document);
        // Xử lý khi người dùng nhấn vào tài liệu
    };

    const handleMorePress = (category: any) => {
        console.log("More pressed for category:", category);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {categories.map((category) => (
                <DocumentSection
                    key={category.id}
                    category={category}
                    onDocumentPress={handleDocumentPress}
                    onMorePress={handleMorePress}
                />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
});

export default HomeScreen;