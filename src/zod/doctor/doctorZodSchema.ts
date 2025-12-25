import z from "zod";

export const createDoctorZodSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.email().nonempty("Email is required or invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profilePhoto: z.file().refine((file) => file.size > 0, {
    message: "Profile photo is required",
  }),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  registrationNumber: z.string().nonempty("Registration number is required"),
  experience: z.number().gte(0, "Experience year can't be negative"),
  gender: z.enum(["MALE", "FEMALE"]),
  appointmentFee: z.number().gt(0, "Appointment fee must be a natural number"),
  qualification: z.string().nonempty("Qualification is required"),
  currentWorkingPlace: z.string().nonempty("Current working place is required"),
  designation: z.string().nonempty("Designation is required"),
  specialities: z.string().nonempty("At least one speciality is required"),
});
