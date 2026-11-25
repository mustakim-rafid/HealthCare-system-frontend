# Health Care — Frontend

Next.js 16 app for a healthcare appointment platform with three roles — **Admin**, **Doctor**, **Patient**.
Patients find a doctor, book a slot, pay securely with Stripe, get reminders and join the consultation on Google Meet.

- **Backend repo:** HealthCare-system-backend (Express + Prisma + PostgreSQL) — API docs at `<API>/api/v1/docs`

## Latest features

- **Booking with payment:** pick a doctor's free slot → slot is held while you pay (Stripe Checkout) → booking is confirmed only after the server verifies the payment. Booked slots disappear from availability; double booking is impossible.
- **Booking details page:** live status, hold countdown and *Pay now*, Google Meet link shown only after confirmation, **Join now** button from 10 minutes before start, **Add to calendar** (Google Calendar + `.ics`), cancellation with the refund policy, review after completion.
- **Postponement:** doctors postpone with a message and a new slot; patients accept or cancel for a full refund. Per-booking **message history** between doctor and patient.
- **Doctor tools:** share/update the Meet link (validated), postpone, message the patient, valid status changes only (in progress, completed, no-show, cancelled).
- **Notifications:** bell with unread counter in every dashboard, real-time updates (SSE with polling fallback), mark as read / mark all as read, full history page with pagination, toasts with an *Open* action. Reminder 10 minutes before the consultation links straight to the booking.
- **Global search** in every dashboard: `Ctrl/⌘ + K`, debounced, stale requests cancelled, role-scoped grouped suggestions (bookings, doctors, patients, specialities, pages), keyboard navigation, loading/empty states and a full results page (`/search?q=`).
- **Admin appointments page** with status filter, search and pagination.
- **Auth:** silent session renewal with the refresh token, automatic redirect to login when the session expires, forgot/reset password.
- **Branding & UX:** new SVG medical logo, favicon/app icon, calm teal brand palette, light/dark/system theme, branded 404 page, page titles and Open Graph tags, skip-to-content link, labelled icon buttons.

## Tech stack

Next.js 16 (App Router, Server Actions, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui (Radix) · cmdk · react-hook-form + Zod · date-fns · Sonner · Recharts

## Getting started

```bash
cp .env.example .env     # point NEXT_PUBLIC_BACKEND_URL at the API, copy the JWT secrets from the backend
npm install
npm run dev              # http://localhost:3000
```

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_BACKEND_URL` | API base URL, e.g. `https://api.example.com/api/v1` (no hard-coded URLs in code) |
| `ACCESS_TOKEN_SECRET` / `REFRESH_TOKEN_SECRET` | Same values as the backend; used to read the role from the httpOnly cookie for route guards |

Scripts: `dev`, `build`, `start`, `lint`, `format`, `format:check`. CI (`.github/workflows/ci.yml`) runs lint and type-check on pull requests.

## How it talks to the API

Data is fetched in Server Components / Server Actions through `src/lib/serverFetch.ts`, which forwards the httpOnly `accessToken` cookie, with tag-based caching and revalidation after mutations. Small route handlers under `src/app/api/*` proxy search (supports `AbortController`) and notifications (including the SSE stream). `src/proxy.ts` guards routes by role, renews expired access tokens and redirects to `/login?redirect=…` when the session is gone.

## User flows

- **Patient:** Consultation → doctor → choose slot → *Confirm & Pay* → Stripe → payment success page → booking details (Meet link, calendar, messages) → reminder → *Join now* → review.
- **Doctor:** *My schedules* → offer slots → notification on a confirmed booking → *Appointments* → open booking → share Meet link / postpone / message → mark completed → prescription.
- **Admin:** *Schedules* → create slots → manage doctors, patients, admins, specialities → *Appointments* to oversee every booking.

## Booking status lifecycle

`Awaiting payment → Confirmed → In progress → Completed` (or `No-show`); `Confirmed ⇄ Postponed`; any active booking can become `Cancelled`. Unpaid holds expire after 30 minutes; finished consultations complete automatically. Patients can cancel paid bookings up to 24 hours before the start for a full refund.

All times are stored in UTC and displayed in the viewer's local time.

## Demo credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | backend `SUPER_ADMIN_EMAIL` (default `admin@healthcare.dev`) | backend `SUPER_ADMIN_PASSWORD` (default `Admin@12345`) |
| Doctor | `doctor@healthcare.dev` | `Doctor@12345` |
| Patient | `patient@healthcare.dev` | `Patient@12345` |

Created by the backend's idempotent seed (`npm run seed`). Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC.
