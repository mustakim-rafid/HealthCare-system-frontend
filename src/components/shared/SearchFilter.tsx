"use client";

import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounceValue } from "usehooks-ts";

interface SearchFilterProps {
  placeholder?: string;
  paramName?: string;
}

const SearchFilter = ({
  placeholder = "Search...",
  paramName = "searchTerm",
}: SearchFilterProps) => {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [shouldRefocus, setShouldRefocus] = useState(false);

  const [debouncedValue] = useDebounceValue(value, 1000);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    const initialValue = searchParams.get(paramName);

    if (initialValue === debouncedValue) {
      return;
    }

    if (value) {
      params.set(paramName, value);
      params.set("page", "1");
    } else {
      params.delete(paramName);
      params.delete("page");
    }

    startTransition(() => {
      setShouldRefocus(true);
      router.push(`?${params.toString()}`);
    });
  }, [debouncedValue]);

  useEffect(() => {
    if (shouldRefocus) {
      inputRef.current?.focus();
      setShouldRefocus(false);
    }
  }, [shouldRefocus]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        placeholder={placeholder}
        className="pl-10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isPending}
      />
    </div>
  );
};

export default SearchFilter;
