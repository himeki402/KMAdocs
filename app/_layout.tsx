import { AuthProvider } from "@/context/authContext";
import { useFrameworkReady } from "@/hooks/useFrameWorkReady";
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    useFonts,
} from "@expo-google-fonts/inter";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent auto-hiding the splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [appIsReady, setAppIsReady] = useState(false);
    useFrameworkReady();
    const [fontsLoaded, fontError] = useFonts({
        "Inter-Regular": Inter_400Regular,
        "Inter-Medium": Inter_500Medium,
        "Inter-Semibold": Inter_600SemiBold,
        "Inter-Bold": Inter_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            setTimeout(() => {
                setAppIsReady(true);
                SplashScreen.hideAsync();
            }, 1000);
        }
    }, [fontsLoaded, fontError]);

    if (!appIsReady) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" color="#0A84FF" />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
                <ActionSheetProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen
                            name="+not-found"
                            options={{ title: "Not Found" }}
                        />
                    </Stack>
                </ActionSheetProvider>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}
