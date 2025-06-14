import { Colors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

export default function MainLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.light.tint,
                tabBarLabelStyle: { fontSize: 12, fontFamily: "Inter-Regular" },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: "Trang chủ",
                    tabBarIcon: ({ color, size }) => {
                        return (
                            <Feather name="home" size={size} color={color} />
                        );
                    },
                    title: "Trang chủ",
                    headerTitle: () => (
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: "#ef4444",
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Feather
                                    name="layers"
                                    size={16}
                                    color="white"
                                />
                            </View>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    color: "#ef4444",
                                    fontFamily: "Inter-Bold",
                                }}
                            >
                                KMA Document
                            </Text>
                        </View>
                    ),
                    headerTransparent: true,
                    headerBackground: () => (
                        <BlurView
                            experimentalBlurMethod="dimezisBlurView"
                            intensity={70}
                            tint="systemThickMaterialDark"
                            style={{ flex: 1 }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    tabBarLabel: "Khám phá",
                    tabBarIcon: ({ color, size }) => {
                        return (
                            <Feather name="search" size={size} color={color} />
                        );
                    },
                    headerShown: true,
                    headerTitle: "Khám phá tài liệu",
                }}
            />
            <Tabs.Screen
                name="library"
                options={{
                    tabBarLabel: "Thư viện",
                    tabBarIcon: ({ color, size }) => {
                        return (
                            <Feather name="book-open" size={size} color={color} />
                        );
                    }, 
                    headerShown: false,               
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarLabel: "Cá nhân",
                    tabBarIcon: ({ color, size }) => {
                        return (
                            <Feather name="user" size={size} color={color} />
                        );
                    },
                    headerTitle: "Tài khoản"
                }}
            />
        </Tabs>
    );
}
