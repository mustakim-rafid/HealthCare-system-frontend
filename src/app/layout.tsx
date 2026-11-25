import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import LoginToastMessage from "@/components/shared/LoginToastMessage";
import LogoutToastMessage from "@/components/shared/LogoutToastMessage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteDescription =
  "Access trusted healthcare services with Health Care. Find the right doctor, book video consultations, receive electronic prescriptions, make secure payments, and manage your health journey through a smart, role-based healthcare platform.";

export const metadata: Metadata = {
  title: {
    default: "Health Care – Book Doctor Appointments & Video Consultations",
    template: "%s | Health Care",
  },
  description: siteDescription,
  applicationName: "Health Care",
  openGraph: {
    type: "website",
    siteName: "Health Care",
    title: "Health Care – Book Doctor Appointments & Video Consultations",
    description: siteDescription,
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1a24" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
          <LoginToastMessage />
          <LogoutToastMessage />
        </ThemeProvider>
      </body>
    </html>
  );
}
