import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface LoadingOverlayProps {
    visible: boolean;
    text?: string;
}

const LoadingOverlay = ({ visible, text = "Đang tải..." }: LoadingOverlayProps) => {
    if (!visible) return null;
    
    return (
        <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.loadingText}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(248,249,250,0.9)",
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 14,
        color: "#6c757d",
        marginTop: 8,
        fontWeight: "500",
    },
});

export default LoadingOverlay;