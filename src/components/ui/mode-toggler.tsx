"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        disabled
        aria-label="Toggle color theme"
        className="opacity-50"
      >
        <Moon aria-hidden="true" />
      </Button>
    );
  }

  // resolvedTheme reflects the actual theme when the preference is "system".
  const isDark = resolvedTheme === "dark";

  const handleThemeChange = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant={"outline"}
      onClick={handleThemeChange}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="dark:hover:bg-primary cursor-pointer h-8 w-8"
    >
      {isDark ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
    </Button>
  );
}
