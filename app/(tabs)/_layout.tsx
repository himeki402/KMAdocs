import { Colors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";

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
                }}
            />
            <Tabs.Screen
                name="library"
                options={{
                    tabBarLabel: "Thư viện",
                    tabBarIcon: ({ color, size }) => {
                        return (
                            <Feather name="book" size={size} color={color} />
                        );
                    },
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
                }}
            />
        </Tabs>
    );
}
