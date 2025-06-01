import { User } from "./auth";

export interface UserResponse {
    data : UserProfile;
}

export interface UserProfile extends User {
    avatar: string;
    bio: string;
    lastLogin?: Date;
    address?: string;
    phone?: string;
    documentsUploaded?: number;
    created_at?: Date;
    updated_at?: Date;
}