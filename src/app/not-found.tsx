import type { Metadata } from "next";
import Link from "next/link";
import { Home, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/shared/Logo";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4 py-16"
    >
      {/* Soft brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <Link href="/" className="mb-10 rounded-md">
          <Logo size={40} textClassName="text-2xl" />
        </Link>

        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Let&apos;s get you back to caring for your health.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <Home aria-hidden="true" />
              Go home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/dashboard">
              <LayoutDashboard aria-hidden="true" />
              Go to dashboard
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
