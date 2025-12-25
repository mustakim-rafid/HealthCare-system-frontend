"use server";

import { serverFetch } from "@/lib/serverFetch";

export const getAiDoctorSuggestion = async (symptoms: string) => {
  try {
    const res = await serverFetch.post("/doctor/suggestion", {
      body: JSON.stringify({ symptoms }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json()
    return result
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      data: [],
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong"
      }`,
    };
  }
};
