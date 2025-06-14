import UploadTab from "@/components/library/UploadTab/UploadTab";
import { privateApi, publicApi } from "@/config/api";
import { AccessType, Document, DocumentsResponse, DocumentStatsResponseDto, UpdateDocumentPayload } from "@/types/document";

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
    ): Promise<DocumentsResponse> => {
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
    ): Promise<DocumentsResponse> => {
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
    getDocumentById: async (id: string): Promise<DocumentsResponse> => {
        try {
            const response = await publicApi.get(`/documents/${id}`);
            const documentData = response.data;
            return documentData;
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
    likeDocument: async (id: string): Promise<void> => {
        try {
            await publicApi.post(`/documents/${id}/like`);
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể thích tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    dislikeDocument: async (id: string): Promise<void> => {
        try {
            await publicApi.post(`/documents/${id}/dislike`);
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể không thích tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    getMyDocuments: async (
        params: DocumentQueryParams = {}
    ): Promise<DocumentsResponse> => {
        try {
            const response = await publicApi.get("/documents/my-documents", {
                params,
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể lấy tài liệu của tôi",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    getDocumentbyId: async (
        id: string
    ): Promise<DocumentsResponse> => {
        try {
            const response = await publicApi.get(`/documents/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể lấy tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    updateDocument: async (
        id: string,
        payload: UpdateDocumentPayload
    ): Promise<Document> => {
        try {
            const response = await privateApi.put(`/documents/${id}`, payload);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể cập nhật tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    FTSDocument: async (
        params: DocumentQueryParams = {}
    ): Promise<DocumentsResponse> => {
        try {
            const response = await privateApi.get("/documents/search", {
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
    getStats: async (): Promise<DocumentStatsResponseDto> => {
        try {
            const response = await privateApi.get("/documents/user/stats");
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể lấy thống kê tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    uploadDocument: async (
        formData: FormData
    ): Promise<Document> => {
        try {
            const response = await privateApi.post("/documents", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 60000,
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể tải lên tài liệu",
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
