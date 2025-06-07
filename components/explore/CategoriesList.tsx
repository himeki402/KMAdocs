import { CategoryService } from "@/services/categoryService";
import { Category } from "@/types/category";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const CategoryList = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const Response = await CategoryService.getCategories();
                setCategories(Response.data);
                console.log("Categories fetched successfully:", Response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <View>
            <Text style={styles.heading}>Browse all</Text>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Text style={styles.item}>{item.name}</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#fff",
    },
    item: {
        fontSize: 16,
        paddingVertical: 8,
        color: "#fff",
    },
});

export default CategoryList;
