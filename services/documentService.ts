import { publicApi } from "@/config/api";
import { AccessType, Document, GetDocumentsResponse } from "@/types/document";

export interface DocumentQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    categoryId?: string;
    slug?: string;
    accessType?: AccessType | "all";
    tag?: string | "all";
    group?: string | "all";
}

export interface SearchDocumentParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    mimeType?: string;
    sortOrder?: "ASC" | "DESC";
    categoryId?: string;
    tag?: string | "all";
}


export const DocumentService = {
    getPublicDocuments: async (
        params: DocumentQueryParams = {}
    ): Promise<GetDocumentsResponse> => {
        try {
            const response = await publicApi.get("/documents/public", {
                params,
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể lấy danh sách tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    getDocumentByCategory: async (
        params: DocumentQueryParams = {}
    ): Promise<GetDocumentsResponse> => {
        try {
            const response = await publicApi.get("/documents/by-category", {
                params,
            });
            return response.data.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể lấy danh sách tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    getDocumentById: async (id: string): Promise<Document> => {
        try {
            const response = await publicApi.get(`/documents/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Không thể lấy tài liệu",
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
