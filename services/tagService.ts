import { privateApi } from "@/config/api";
import { TagsResponse } from "@/types/tag";

export const TagService = {
    getTag: async (): Promise<TagsResponse> => {
        try {
            const response = await privateApi.get("/tags");
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
