import { useAuth } from "@/context/authContext";
import { Text, View } from "react-native";

const LibraryScreen = () => {
    const { user, isAuthenticated } = useAuth();
    return (
        <View>
            <Text>Thư viện</Text>
            {isAuthenticated && user && (
                <View>
                    <Text>{user.name}</Text>
                    <Text>{user.email}</Text>
                </View>
            )}
        </View>
    );
};

export default LibraryScreen;
