import { privateApi } from "@/config/api";
import { UserResponse } from "@/types/user";

export const UserService = {
    getUserProfile: async (): Promise<UserResponse> => {
        try {
            const response = await privateApi.get("/auth/me");
            const user = response.data;
            return user;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    },
};
