"use server";

import { serverFetch } from "@/lib/serverFetch";
import { createSpecialityZodSchema } from "@/zod/speciality/specialityZodSchema";

export const createSpeciality = async (
  _initialState: any,
  formData: FormData
) => {
  try {
    const data = {
      title: formData.get("title"),
    };

    const zodResponse = createSpecialityZodSchema.safeParse(data);

    if (!zodResponse.success) {
      return {
        success: false,
        errors: zodResponse.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      };
    }

    const newFormData = new FormData();

    newFormData.append("title", zodResponse.data.title);

    const file = formData.get("icon");
    if (file instanceof File && file.size > 0 && file.name !== undefined) {
      newFormData.append("icon", file);
    }

    const res = await serverFetch.post("/speciality", {
      body: newFormData,
    });

    const result = await res.json();

    return result
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      err: error.message || "Something went wrong",
    };
  }
};

export const getAllSpecialities = async () => {
  try {
    const res = await serverFetch.get("/speciality");
    const result = await res.json();
    return result
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      err: error.message || "Something went wrong",
    };
  }
};

export const deleteSpeciality = async (id: string) => {
  try {
    const res = await serverFetch.delete(`/speciality/${id}`)
    const result = await res.json()
    return result
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      err: error.message || "Something went wrong",
    };
  }
};
