"use server";

import { loginUser } from "./loginUser";
import { serverFetch } from "@/lib/serverFetch";
import { getZodErrorResponse } from "@/utils/zodErrorResponse";
import { patientRegisterZodSchema } from "@/zod/patient/patientZodSchema";

export const registerPatient = async (
  _initialState: any,
  formData: FormData
) => {
  try {
    const validationData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      address: formData.get("address"),
      contactNumber: formData.get("contactNumber"),
    };

    const zodResponse = patientRegisterZodSchema.safeParse(validationData);

    if (!zodResponse.success) return getZodErrorResponse(zodResponse)

    const user = {
      password: zodResponse.data.password,
      patient: {
        name: zodResponse.data.name,
        email: zodResponse.data.email,
        ...(zodResponse.data.address!.length > 0 && {
          address: zodResponse.data.address,
        }),
        ...(zodResponse.data.contactNumber!.length > 0 && {
          contactNumber: zodResponse.data.contactNumber,
        }),
      },
    };

    const newFormData = new FormData();

    newFormData.set("user", JSON.stringify(user));

    const file = formData.get("file");
    if (file instanceof File && file.size > 0 && file.name !== undefined) {
      newFormData.set("file", formData.get("file") as Blob);
    }

    const res = await serverFetch.post("/user/create-patient", {
      body: formData
    })

    const result = await res.json()

    if (!result.success && result.error) {
      return result
    }

    if (result.success) {
      await loginUser(_initialState, formData)
    }

  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error(error)
    return {
        success: false,
        message: "Patient creation failed"
    }
  }
};
