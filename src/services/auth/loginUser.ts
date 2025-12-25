"use server";

import { parse } from "cookie";
import { cookies } from "next/headers";
import { UserRole } from "@/types/common";
import jwt from "jsonwebtoken";
import {
  getDefaultDashboardRoute,
  isValidRouteForRole,
} from "@/utils/auth-utils";
import { redirect } from "next/navigation";
import { setCookie } from "./tokenHandlers";
import { serverFetch } from "@/lib/serverFetch";
import { loginUserZodSchema } from "@/zod/auth/loginZodSchema";

export const loginUser = async (_initialState: any, formData: FormData) => {
  try {
    const redirectTo = formData.get("redirect") || null;

    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;
    const validationData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const zodResponse = loginUserZodSchema.safeParse(validationData);

    if (!zodResponse.success) {
      return {
        success: false,
        errors: zodResponse.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      };
    }

    const res = await serverFetch.post("/auth/login", {
      body: JSON.stringify(zodResponse.data),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await res.json();

    if (!result.success && result.error) {
      return result;
    }

    const headers = res.headers.getSetCookie();

    if (headers && headers.length > 0) {
      headers.forEach((cookie) => {
        const parsedCookie = parse(cookie);
        if (parsedCookie["accessToken"]) {
          accessTokenObject = parsedCookie;
        }
        if (parsedCookie["refreshToken"]) {
          refreshTokenObject = parsedCookie;
        }
      });
    } else {
      throw new Error("No set-cookie header found");
    }

    if (!accessTokenObject && !refreshTokenObject) {
      throw new Error("No cookies found from the request");
    }

    await setCookie("accessToken", accessTokenObject["accessToken"], {
      httpOnly: true,
      secure: true,
      maxAge: parseInt(accessTokenObject["Max-Age"]),
      path: accessTokenObject["Path"] || "/",
      sameSite: "none",
    });

    await setCookie("refreshToken", refreshTokenObject["refreshToken"], {
      httpOnly: true,
      secure: true,
      maxAge: parseInt(refreshTokenObject["Max-Age"]),
      path: refreshTokenObject["Path"] || "/",
      sameSite: "none",
    });

    const verifyToken = jwt.verify(
      accessTokenObject.accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    );
    if (typeof verifyToken === "string") {
      throw new Error("Invalid token");
    }
    const userRole: UserRole = verifyToken.role;

    if (redirectTo) {
      if (isValidRouteForRole(redirectTo as string, userRole)) {
        redirect(`${redirectTo}?loggedIn=true`);
      } else {
        redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
      }
    } else {
      redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
    }
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error(error);
    return {
      success: false,
      message: "Login failed",
    };
  }
};
