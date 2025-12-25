"use server";

import { UserInfo, UserJwtPayload } from "@/types/user.interface";
import { getCookie } from "./tokenHandlers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { serverFetch } from "@/lib/serverFetch";

export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const accessToken = await getCookie("accessToken");

    if (!accessToken) {
      return null;
    }

    const verifyToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    ) as UserJwtPayload;

    if (!verifyToken.email) {
      return null;
    }

    return {
      email: verifyToken.email,
      role: verifyToken.role,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUserInfoForProfile = async (): Promise<UserInfo | any> => {
  let userInfo: UserInfo | any;
  try {
    const response = await serverFetch.get("/auth/getme", {
      next: { tags: ["user-info"], revalidate: 180 },
    });

    const result = await response.json();
    console.log(result)

    userInfo = result.data

    return userInfo;
  } catch (error: any) {
    console.log(error);
    return {
      id: "",
      name: "Unknown User",
      email: "",
      role: "PATIENT",
    };
  }
};
