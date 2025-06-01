import { useRef, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface TabBarProps {
    tabs: string[];
    activeTab: string;
    onTabPress: (tab: string) => void;
}

const TabBar = ({ tabs, activeTab, onTabPress }: TabBarProps) => {
    const [tabLayouts, setTabLayouts] = useState<
        Record<string, { x: number; width: number }>
    >({});
    const borderAnimation = useRef(new Animated.Value(0)).current;

    const handleTabLayout = (event: any, tab: string) => {
        const { x, width } = event.nativeEvent.layout;
        setTabLayouts((prev) => ({
            ...prev,
            [tab]: { x, width },
        }));
        if (tab === "Tài liệu" && Object.keys(tabLayouts).length === 0) {
            borderAnimation.setValue(x);
        }
    };

    const handleTabPress = (tab: string) => {
        if (tabLayouts[tab]) {
            Animated.spring(borderAnimation, {
                toValue: tabLayouts[tab].x,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }).start();
        }
        onTabPress(tab);
    };

    return (
        <View style={styles.tabsContainer}>
            <View style={styles.tabsRow}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => handleTabPress(tab)}
                        style={styles.tabButton}
                        onLayout={(event) => handleTabLayout(event, tab)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab
                                    ? styles.tabTextActive
                                    : styles.tabTextInactive,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.borderContainer}>
                <Animated.View
                    style={[
                        styles.animatedBorder,
                        {
                            transform: [{ translateX: borderAnimation }],
                            width: tabLayouts[activeTab]?.width || 0,
                        },
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tabsContainer: {
        position: "relative",
        marginBottom: 16,
    },
    tabsRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    tabButton: {
        marginRight: 20,
        paddingVertical: 12,
        paddingHorizontal: 4,
        minHeight: 44,
        justifyContent: "center",
    },
    tabText: {
        fontSize: 16,
        textAlign: "center",
    },
    tabTextActive: {
        color: "#667eea",
        fontWeight: "600",
    },
    tabTextInactive: {
        color: "#888",
        fontWeight: "400",
    },
    borderContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: "#f0f0f0",
    },
    animatedBorder: {
        height: 2,
        backgroundColor: "#667eea",
        borderRadius: 1,
    },
});

export default TabBar;
