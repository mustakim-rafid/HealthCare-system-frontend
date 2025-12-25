# 🏥 Health Care System – Frontend

This is the **frontend application** for the **Health Care System**, a modern healthcare platform that connects **Patients**, **Doctors**, and **Admins** for seamless online medical services.  
Patients can find doctors, book video consultations, receive electronic prescriptions, and manage appointments — all through a secure and intuitive interface.

---

## 🚀 Project Overview

The frontend is built using **Next.js (App Router)** to deliver a fast, scalable, and SEO-friendly user experience.  
It communicates with a robust backend API to support **role-based dashboards**, **real-time appointment workflows**, and **AI-powered doctor suggestions**.

### 🔑 Key Highlights
- Role-based UI for **Admin**, **Doctor**, and **Patient**
- Secure **JWT-based authentication**
- **AI-driven doctor recommendation**
- **Video consultation booking flow**
- **Electronic prescription management**
- Fully **responsive** and mobile-friendly design

---

## 🔍 Features Overview

### 🔐 Authentication & Authorization
- Login, logout, and token refresh
- Role-based routing (Admin / Doctor / Patient)
- Protected pages and layouts
- Persistent authentication using cookies

---

### 👤 User & Profile Management
- View and update profile details
- Upload profile photo
- Role-specific profile information
- Admin access to system users

---

### 🩺 Doctor Discovery & AI Suggestion
- Browse doctors by speciality
- View detailed doctor profiles
- **AI-powered doctor suggestion** based on symptoms
- Ratings and reviews display

---

### 📅 Appointment & Consultation
- Patients can:
  - View doctor availability
  - Book video consultation appointments
  - Choose schedule and payment method
- Doctors can:
  - View appointments
  - Update appointment status
- Appointment history for Patients and Doctors

---

### 💊 Electronic Prescription
- Doctors can issue digital prescriptions
- Patients can view and download prescriptions
- Secure prescription history tracking

---

### ⭐ Reviews & Ratings
- Patients can submit reviews after consultation
- Public review listing for doctors
- Rating-based trust indicators

---

### 📊 Dashboards
- **Admin Dashboard**
  - System metrics
  - User and appointment insights
- **Doctor Dashboard**
  - Appointments
  - Schedules
  - Prescriptions
- **Patient Dashboard**
  - Appointments
  - Prescriptions
  - Reviews

---

### 💳 Payment Experience
- Pay-later appointment option
- Secure and user-friendly booking flow
- Payment status visibility

---

## 🧰 Technology Stack

- **Next.js (App Router)** – Modern React framework with SSR & RSC
- **TypeScript** – Strongly typed frontend
- **Tailwind CSS** – Utility-first responsive styling
- **ShadCN UI** – Accessible UI components
- **JWT Authentication** – Secure session handling
- **Zod** – validation

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/mustakim-rafid/HealthCare-system-frontend
cd HealthCare-system-frontend
```

### 2. Install dependencies
```
npm install
# or if using pnpm
pnpm install
# or bun
bun add
```

### 3. Create a .env file in the root directory:
```
NEXT_PUBLIC_BACKEND_URL=

# jwt secrets
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
```

### 4. Run the development server
```
npm run dev
# or
pnpm dev
# or
bun dev
```

### 5. Build for production
```
npm run build
npm start
```
---
## Thanks.
