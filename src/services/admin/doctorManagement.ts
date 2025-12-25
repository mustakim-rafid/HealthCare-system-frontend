"use server";

import { serverFetch } from "@/lib/serverFetch";
import { IDoctor, IUpdateDoctorPayload } from "@/types/doctor.interface";
import { getZodErrorResponse } from "@/utils/zodErrorResponse";
import { createDoctorZodSchema } from "@/zod/doctor/doctorZodSchema";
export const createDoctor = async (_initialState: any, formData: FormData) => {
  try {
    const validationData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      contactNumber: formData.get("contactNumber"),
      address: formData.get("address"),
      registrationNumber: formData.get("registrationNumber"),
      experience: Number(formData.get("experience")),
      gender: formData.get("gender") as "MALE" | "FEMALE",
      appointmentFee: Number(formData.get("appointmentFee")),
      qualification: formData.get("qualification"),
      currentWorkingPlace: formData.get("currentWorkingPlace"),
      designation: formData.get("designation"),
      specialities: formData.get("specialities"),
      profilePhoto: formData.get("profilePhoto"),
    };
    
    const zodResponse = createDoctorZodSchema.safeParse(validationData);

    if (!zodResponse.success) {
      return getZodErrorResponse(zodResponse, validationData)
    };

    const { password, specialities, ...restData } = zodResponse.data;

    const doctorFormData = {
      password,
      doctor: {
        ...restData,
        specialities: specialities.split(",")
      },
    };

    const newFormData = new FormData();

    newFormData.set("user", JSON.stringify(doctorFormData));

    const file = formData.get("profilePhoto");
    if (file instanceof File && file.size > 0 && file.name !== undefined) {
      newFormData.set("file", formData.get("profilePhoto") as Blob);
    }

    const res = await serverFetch.post("/user/create-doctor", {
      body: newFormData,
    });
    const result = await res.json();

    return result;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      error: error.message || "Something went wrong",
    };
  }
};

export const getAllDoctors = async (queryParams?: string) => {
  try {
    const res = await serverFetch.get(
      `/doctor?${queryParams ? queryParams : ""}`
    );
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      error: error.message || "Something went wrong",
    };
  }
};

export const getDoctorById = async (id: string) => {
  try {
    const res = await serverFetch.get(`/doctor/${id}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      error: error.message || "Something went wrong",
    };
  }
}

export const deleteDoctor = async (id: string) => {
  try {
    const res = await serverFetch.delete(`/doctor/${id}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      error: error.message || "Something went wrong",
    };
  }
};

export const updateDoctor = async (
  id: string,
  _initialState: any,
  formData: FormData
) => {
  const specialities = JSON.parse(formData.get("specialities") as string)

  const updateDoctorData: IUpdateDoctorPayload = {
    name: formData.get("name") as string,
    contactNumber: (formData.get("contactNumber") as string) ?? null,
    address: (formData.get("address") as string) ?? null,
    experience: formData.get("experience")
      ? Number(formData.get("experience"))
      : undefined,
    gender: formData.get("gender") as "MALE" | "FEMALE",
    appointmentFee: formData.get("appointmentFee")
      ? Number(formData.get("appointmentFee"))
      : undefined,
    qualification: formData.get("qualification") as string,
    registrationNumber: formData.get("registrationNumber") as string,
    currentWorkingPlace: formData.get("currentWorkingPlace") as string,
    designation: formData.get("designation") as string,
    specialities
  };

  try {
    const res = await serverFetch.patch(`/doctor/${id}`, {
      body: JSON.stringify(updateDoctorData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await res.json()

    return result
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      error: error.message || "Something went wrong",
    };
  }
};
