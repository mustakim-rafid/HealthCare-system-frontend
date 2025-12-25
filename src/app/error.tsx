"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full text-center shadow-lg p-8 border-none">
        <CardHeader>
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4 animate-pulse" />
          <CardTitle className="text-3xl font-bold">Something Went Wrong</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            {error?.message || "An unexpected error occurred. Please try again later."}
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-6 flex flex-col gap-3">
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => reset()}
          >
            Retry
          </Button>

          <Link href="/">
            <Button variant="outline" className="w-full">
              Go Back Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
