"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export function LimitSelect() {
  const [value, setValue] = useState("10");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const limit = searchParams.get("limit") ?? "10";
    setValue(limit);
  }, [searchParams]);

  const handleChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", val.toString());
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        Items per page
      </span>

      <Select value={value} onValueChange={handleChange} disabled={isPending}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Select a number" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
