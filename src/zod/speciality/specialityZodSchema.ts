import z from "zod";

export const createSpecialityZodSchema = z.object({
  title: z.string().min(3, "Speciality name too small"),
});