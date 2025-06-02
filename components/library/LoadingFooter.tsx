import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface LoadingFooterProps {
    visible: boolean;
    text?: string;
}

const LoadingFooter = ({ visible, text = "Đang tải thêm..." }: LoadingFooterProps) => {
    if (!visible) return null;
    
    return (
        <View style={styles.loadingFooter}>
            <ActivityIndicator size="small" color="#667eea" />
            <Text style={styles.loadingText}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingFooter: {
        paddingVertical: 20,
        alignItems: "center",
    },
    loadingText: {
        fontSize: 14,
        color: "#6c757d",
        marginTop: 8,
        fontWeight: "500",
    },
});

export default LoadingFooter;