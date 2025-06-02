import { privateApi } from "@/config/api";
import { CreateGroupRequest, Group, GroupResponse } from "@/types/group";

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
    createGroup: async ( data: CreateGroupRequest): Promise<Group> => {
        try {
            const response = await privateApi.post("/groups", data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Không thể tạo nhóm",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    updateGroup: async (tagId: string, tag: Partial<Group>): Promise<Group> => {
        try {
            const response = await privateApi.put(`/groups/${tagId}`, tag);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Không thể cập nhật tag",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    deleteGroup: async (groupId: string): Promise<void> => {
        try {
            await privateApi.delete(`/groups/${groupId}`);
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Không thể xóa nhóm",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    getGroupById: async (groupId: string): Promise<{ data: Group }> => {
    try {
        const response = await privateApi.get(`/groups/${groupId}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw {
                status: error.response.status,
                message:
                    error.response.data.message || "Không thể tải thông tin nhóm",
            };
        }
        throw {
            status: 500,
            message: error.message || "Lỗi máy chủ nội bộ",
        };
    }
},
};
