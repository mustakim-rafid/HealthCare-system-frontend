"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const LogoutToastMessage = () => {
  const searchParams = useSearchParams();
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (searchParams.get("loggedOut") === "true") {
      toast.success("Logged out successfully!");
      router.replace(pathname)
    }
  }, [searchParams]);

  return null;
};

export default LogoutToastMessage;
