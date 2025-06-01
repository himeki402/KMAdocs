import { Document } from "@/types/document";
import { StyleSheet, View, ScrollView } from "react-native";
import { useState } from "react";
import DocumentSection from "@/components/document/DocumentSection";
import HeroBanner from "@/components/document/HeroBanner";
import { router } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const HomeScreen = () => {
    const headerHeight = useHeaderHeight();
    const bottomTabBarHeight = useBottomTabBarHeight();
    const [categories] = useState([
        { id: "1", name: "Sách Giáo Trình", slug: "Sach-giao-trinh" },
        { id: "2", name: "Tài liệu tham khảo", slug: "Tai-lieu-tham-khao" },
        { id: "3", name: "Tài liệu Chuyên ngành", slug: "tai-lieu-chuyen-nganh" },
        { id: "4", name: "Tài liệu ngoại ngữ", slug: "Tai-lieu-ngoai-ngu" },
    ]);

    const handleDocumentPress = (document: Document) => {
        router.push({
            pathname: "/document/[id]",
            params: { id: document.id }
        });
    };

    const handleMorePress = (category: any) => {
        router.push({
            pathname: "/category/[slug]",
            params: { slug: category.slug, name: category.name }
        });
    };

    const handleSearchPress = () => {
        router.push("/explore")
    };

    const handleManagePress = () => {
        router.push("/library")
    };

    return (
        <ScrollView style={[styles.container, { paddingTop: headerHeight }]} contentContainerStyle={{ paddingBottom: bottomTabBarHeight + 20 }} showsVerticalScrollIndicator={false}>
            <HeroBanner
                onSearchPress={handleSearchPress}
                onManagePress={handleManagePress}
            />
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