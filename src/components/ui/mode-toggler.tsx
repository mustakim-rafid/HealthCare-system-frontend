"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="outline" disabled className="opacity-50">
        <Moon />
      </Button>
    );
  }

  const handleThemeChange = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <Button
      variant={"outline"}
      onClick={handleThemeChange}
      className="dark:hover:bg-primary cursor-pointer h-8 w-8"
    >
      {theme === "dark" ? <Moon /> : <Sun />}
    </Button>
  );
}
