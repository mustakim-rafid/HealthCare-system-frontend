"use server";

import { serverFetch } from "@/lib/serverFetch";

export async function requestPasswordReset(email: string) {
  try {
    const res = await serverFetch.post("/auth/forgot-password", {
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong, please try again" };
  }
}

export async function resetPassword(token: string, password: string) {
  try {
    const res = await serverFetch.post("/auth/reset-password", {
      body: JSON.stringify({ token, password }),
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong, please try again" };
  }
}
