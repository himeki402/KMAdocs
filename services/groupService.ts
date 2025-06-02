import { privateApi } from "@/config/api";
import { GroupResponse } from "@/types/group";

export const GroupService = {
    getMygroups: async (): Promise<GroupResponse> => {
        try {
            const response = await privateApi.get("/groups/me");
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Lỗi máy chủ nội bộ",
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
};
