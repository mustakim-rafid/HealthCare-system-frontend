"use server";

import { serverFetch } from "@/lib/serverFetch";
import { getZodErrorResponse } from "@/utils/zodErrorResponse";
import { createScheduleZodSchema } from "@/zod/schedule/scheduleZodSchema";

export const createSchedule = async (
  _initialState: any,
  formData: FormData
) => {
  try {
    const payload = {
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
    };

    const zodResponse = createScheduleZodSchema.safeParse(payload);

    if (!zodResponse.success) {
      return getZodErrorResponse(zodResponse);
    }

    console.log(zodResponse)

    const res = await serverFetch.post(`/schedule`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(zodResponse.data),
    })
    const result = await res.json()
    console.log(result)
    return result
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      error: error.message || "Something went wrong",
    };
  }
};

export const getAllSchedules = async (queryParams: string) => {
  try {
    const res = await serverFetch.get(
      `/schedule?${queryParams ? queryParams : ""}`
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

export const deleteSchedule = async (id: string) => {
  try {
    const res = await serverFetch.delete(`/schedule/${id}`);
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

export async function getScheduleById(id: string) {
    try {
        const response = await serverFetch.get(`/schedule/${id}`, {
            next: {
                tags: [`schedule-${id}`, "schedules-list"],
                revalidate: 180,
            }
        })
        const result = await response.json();
        return result;
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        };
    }
}
