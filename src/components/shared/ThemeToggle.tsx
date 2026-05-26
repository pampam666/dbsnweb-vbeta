"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/shared/Button";
import { Sun, Moon } from "lucide-react";

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function subscribe() {
  return () => {};
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="min-h-[44px] min-w-[44px] w-11 h-11"
        aria-label="Toggle tema"
      >
        <span className="sr-only">Toggle tema</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="min-h-[44px] min-w-[44px] w-11 h-11 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors duration-200"
      aria-label={theme === "dark" ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-400 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 text-emerald-700 transition-transform duration-200 hover:-rotate-12" />
      )}
      <span className="sr-only">Toggle tema</span>
    </Button>
  );
}
