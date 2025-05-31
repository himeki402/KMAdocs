import { useAuth } from "@/context/authContext";
import { Text, View } from "react-native";

const LibraryScreen = () => {
    const { user } = useAuth();
    return (
        <View>
            <Text>Thư viện</Text>
            {user && (
                <View>
                    <Text>{user.name}</Text>
                    <Text>{user.email}</Text>
                </View>
            )}
        </View>
    );
};

export default LibraryScreen;
