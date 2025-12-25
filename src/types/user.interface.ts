import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "./common";

export interface UserInfo {
    id?: string;
    name?: string;
    email: string;
    role: UserRole;
    needPasswordChange?: boolean;
    status?: "ACTIVE" | "BLOCKED" | "DELETED";
    admin?: any;
    patient?: any;
    doctor?: any;
    createdA?: string;
    updatedAt?: string;
}

export type UserJwtPayload = JwtPayload & {
    email: string;
    role: UserRole;
}