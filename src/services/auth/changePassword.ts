"use server";

import { serverFetch } from "@/lib/serverFetch";
import { getZodErrorResponse } from "@/utils/zodErrorResponse";import { changePasswordZodSchema } from "@/zod/auth/changePassZodSchema";

export const changePassword = async (
  _initialState: any,
  formData: FormData
) => {
  try {
    const data = {
      oldPassword: formData.get("oldPassword"),
      newPassword: formData.get("newPassword"),
      confirmNewPassword: formData.get("confirmNewPassword"),
    };

    const zodResponse = changePasswordZodSchema.safeParse(data);

    if (!zodResponse.success) {
      return getZodErrorResponse(zodResponse, data);
    }

    const { confirmNewPassword, ...changePasswordData } = zodResponse.data;

    const res = await serverFetch.patch("/auth/change-password", {
      body: JSON.stringify(changePasswordData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    return result;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Change password process failed",
    };
  }
};
