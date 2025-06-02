import { privateApi } from "@/config/api";
import { CategoryResponse } from "@/types/category";

export const CategoryService = {
    getCategories: async (): Promise<CategoryResponse> => {
        try {
            const response = await privateApi.get("/categories");
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể lấy danh sách danh mục",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
};
