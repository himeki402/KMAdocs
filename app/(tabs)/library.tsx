import Header from "@/components/library/Header";
import TabBar from "@/components/library/TabBar";
import TabContent from "@/components/library/TabContent";
import { useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

const LibraryScreen = () => {
    const tabs = ["Tài liệu", "Nhóm", "Tải lên", "Thống kê"];
    const [activeTab, setActiveTab] = useState<string>("Tài liệu");
    const opacityAnimation = useRef(new Animated.Value(1)).current;

    const handleTabPress = (tab: string) => {
        // Animate opacity for smoother transition
        Animated.sequence([
            Animated.timing(opacityAnimation, {
                toValue: 0.7,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnimation, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
        setActiveTab(tab);
    };

    return (
        <View style={styles.container}>
            <Header />
            <TabBar
                tabs={tabs}
                activeTab={activeTab}
                onTabPress={handleTabPress}
            />
            <TabContent
                activeTab={activeTab}
                opacityAnimation={opacityAnimation}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 16,
    },
});

export default LibraryScreen;
