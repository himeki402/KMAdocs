export type Document = {
    id: string;
    title: string;
    mimeType: string;
    fileSize: number;
    created_at: string;
    createdBy: { id: string; name: string };
}

export interface Group {
    id: string;
    name: string;
    description: string;
    members?: Member[];
    created_at: string;
    updated_at: string;
    groupAdmin?: { id: string; name: string };
    memberCount: number;
    documentCount: number;
    documents?: Document[];
    isAdmin: boolean;
}
export interface Member {
    user_id: string;
    user: { id: string; name: string; email: string; avatar?: string };
    group_id: string;
    joined_at: string;
    role: "MEMBER" | "ADMIN";
    avatar?: string;
}
export interface GroupResponse {
    data: Group[];
}

export interface GroupQueryParams {
    limit?: number;
    page?: number;
    search?: string;
}

export interface CreateGroupRequest {
    name: string;
    description: string;
}

export interface UpdateGroupRequest {
    name?: string;
    description?: string;
}

export interface AddMember {
    email: string;
}

export interface AddMultipleMembers {
  members: AddMember[];
}

export interface RemoveMemberRequest {
    email: string;
}
