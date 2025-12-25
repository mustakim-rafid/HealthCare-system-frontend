import z from "zod";

export const patientRegisterZodSchema = z
  .object({
    name: z.string().nonempty("Name is required"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    address: z.string().optional(),
    contactNumber: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });