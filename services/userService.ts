import { privateApi } from "@/config/api";
import { UserProfile } from "@/types/user";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export const UserService = {
    getUserProfile: async (): Promise<UserProfile> => {
        try {
            const response = await privateApi.get("/auth/me");
            return response.data;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    }
}