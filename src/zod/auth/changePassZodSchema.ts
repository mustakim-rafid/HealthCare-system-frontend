import z from "zod";

export const changePasswordZodSchema = z.object({
    oldPassword: z.string().min(6, "Password must be at least 6 characters long"),
    newPassword: z.string().min(6, "Password must be at least 6 characters long"),
    confirmNewPassword: z.string().min(6, "Password must be at least 6 characters long"),
})