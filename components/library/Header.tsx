import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
    onSearchPress?: () => void;
}

const Header = ({ onSearchPress }: HeaderProps) => {
    return (
        <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Thư viện</Text>
            <View style={styles.headerIcons}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={onSearchPress}
                >
                    <Feather name="search" size={22} color="#667eea" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    headerTitle: {
        color: "#111",
        fontSize: 22,
        fontWeight: "bold",
    },
    headerIcons: {
        flexDirection: "row",
        gap: 16,
        paddingRight: 8,
    },
    iconButton: {
        padding: 4,
    },
});

export default Header;
