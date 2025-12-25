"use server"

import { serverFetch } from "@/lib/serverFetch";
import { getUserInfo } from "../auth/getUserInfo";
import { UserInfo } from "@/types/user.interface";

export async function getDashboardMetaData() {
    try {
        const userInfo = await getUserInfo();
        const cacheTag = `${(userInfo as UserInfo).role.toLowerCase()}-dashboard-meta`;

        const response = await serverFetch.get("/meta", {
            next: {
                tags: [cacheTag, "dashboard-meta", "meta-data"],
                revalidate: 30,
            }
        });
        const result = await response.json();
        return result;
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        };
    }
}

