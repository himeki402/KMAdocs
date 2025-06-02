import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
}

const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
    return (
        <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>{icon}</Text>
            </View>
            <Text style={styles.emptyStateTitle}>{title}</Text>
            <Text style={styles.emptyStateText}>{description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        backgroundColor: "#f8f9fa",
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#e9ecef",
    },
    emptyIconText: {
        fontSize: 32,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#007bff",
        marginBottom: 8,
        textAlign: "center",
    },
    emptyStateText: {
        fontSize: 14,
        color: "#6c757d",
        textAlign: "center",
        lineHeight: 20,
        maxWidth: 280,
    },
});

export default EmptyState;