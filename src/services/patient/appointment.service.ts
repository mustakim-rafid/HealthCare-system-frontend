"use server";
import { serverFetch } from "@/lib/serverFetch";
import { IAppointmentFormData } from "@/types/appointments.interface";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";

/** Origin of this frontend, so Stripe returns the patient to the right deployment. */
const currentOrigin = async () => {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return host ? `${proto}://${host}` : undefined;
};

type ApiResult<T = any> = { success: boolean; message?: string; data?: T; meta?: any };

const fail = (error: unknown, fallback: string): ApiResult => ({
  success: false,
  message: process.env.NODE_ENV === "development" && error instanceof Error ? error.message : fallback,
});

const invalidate = (appointmentId?: string) => {
  ["my-appointments", "appointments-list", "patient-dashboard-meta", "admin-dashboard-meta", "doctor-dashboard-meta", "dashboard-meta", "notifications", "my-schedules"].forEach(
    (t) => revalidateTag(t, { expire: 0 })
  );
  if (appointmentId) revalidateTag(`appointment-${appointmentId}`, { expire: 0 });
};

const send = async (method: "post" | "patch", path: string, body?: unknown, appointmentId?: string): Promise<ApiResult> => {
  const res = await serverFetch[method](path, {
    body: body ? JSON.stringify(body) : undefined,
    headers: { "Content-Type": "application/json" },
  });
  const result = await res.json();
  if (result.success) invalidate(appointmentId);
  return result;
};

/** Holds the slot and returns a Stripe Checkout URL (booking is confirmed only after payment). */
export async function createAppointment(data: IAppointmentFormData) {
  try {
    return await send("post", "/appointment", { ...data, returnOrigin: await currentOrigin() });
  } catch (error) {
    return fail(error, "Failed to book appointment");
  }
}

/** Legacy alias kept for existing imports — now behaves like createAppointment without checkout. */
export async function createAppointmentWithPayLater(data: IAppointmentFormData) {
  try {
    return await send("post", "/appointment/pay-later", data);
  } catch (error) {
    return fail(error, "Failed to book appointment");
  }
}

export async function payForAppointment(appointmentId: string) {
  try {
    return await send("post", `/payment/checkout/${appointmentId}`, { returnOrigin: await currentOrigin() }, appointmentId);
  } catch (error) {
    return fail(error, "Could not start payment");
  }
}

export async function verifyPayment(sessionId: string) {
  try {
    return await send("post", `/payment/verify`, { sessionId });
  } catch (error) {
    return fail(error, "Could not verify payment");
  }
}

export async function getMyAppointments(queryString?: string) {
  try {
    const response = await serverFetch.get(
      `/appointment/my-appointment${queryString ? `?${queryString}` : "?sortBy=createdAt&sortOrder=desc"}`,
      { next: { tags: ["my-appointments"], revalidate: 30 } }
    );
    return await response.json();
  } catch (error) {
    return { ...fail(error, "Failed to fetch appointments"), data: [] };
  }
}

export async function getAppointmentById(appointmentId: string) {
  try {
    const response = await serverFetch.get(`/appointment/${appointmentId}`, { cache: "no-store" });
    return await response.json();
  } catch (error) {
    return { ...fail(error, "Failed to fetch appointment"), data: null };
  }
}

export async function changeAppointmentStatus(appointmentId: string, status: string, reason?: string) {
  try {
    return await send("patch", `/appointment/${appointmentId}/update-status`, { status, reason }, appointmentId);
  } catch (error) {
    return fail(error, "Failed to change appointment status");
  }
}

export async function cancelAppointment(appointmentId: string, reason?: string) {
  try {
    return await send("post", `/appointment/${appointmentId}/cancel`, { reason }, appointmentId);
  } catch (error) {
    return fail(error, "Failed to cancel appointment");
  }
}

export async function respondToPostponement(appointmentId: string, action: "accept" | "cancel") {
  try {
    return await send("post", `/appointment/${appointmentId}/postpone/respond`, { action }, appointmentId);
  } catch (error) {
    return fail(error, "Failed to respond");
  }
}

export async function setMeetLink(appointmentId: string, meetLink: string) {
  try {
    return await send("patch", `/appointment/${appointmentId}/meet-link`, { meetLink }, appointmentId);
  } catch (error) {
    return fail(error, "Failed to save the Meet link");
  }
}

export async function postponeAppointment(appointmentId: string, newScheduleId: string, message: string) {
  try {
    return await send("post", `/appointment/${appointmentId}/postpone`, { newScheduleId, message }, appointmentId);
  } catch (error) {
    return fail(error, "Failed to postpone");
  }
}

export async function getAppointmentMessages(appointmentId: string) {
  try {
    const response = await serverFetch.get(`/appointment/${appointmentId}/messages`, { cache: "no-store" });
    return await response.json();
  } catch (error) {
    return { ...fail(error, "Failed to load messages"), data: [] };
  }
}

export async function sendAppointmentMessage(appointmentId: string, body: string) {
  try {
    return await send("post", `/appointment/${appointmentId}/messages`, { body });
  } catch (error) {
    return fail(error, "Failed to send message");
  }
}

/** Doctor: own future, unbooked slots (used to pick a new time when postponing). */
export async function getMyFreeSlots() {
  try {
    const response = await serverFetch.get(`/doctor-schedule/my-schedule?isBooked=false&upcoming=true&limit=100&sortOrder=asc`, {
      cache: "no-store",
    });
    return await response.json();
  } catch (error) {
    return { ...fail(error, "Failed to load slots"), data: [] };
  }
}
