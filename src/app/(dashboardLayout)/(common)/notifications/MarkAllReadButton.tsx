"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function MarkAllReadButton({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <Button
      variant="outline"
      disabled={disabled || pending}
      onClick={() =>
        start(async () => {
          const res = await fetch("/api/notifications", { method: "PATCH", body: JSON.stringify({ action: "read-all" }) });
          if (res.ok) {
            toast.success("All notifications marked as read");
            router.refresh();
          } else toast.error("Could not update notifications");
        })
      }
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCheck className="mr-2 h-4 w-4" />}
      Mark all as read
    </Button>
  );
}
