"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const current = theme === "system" ? systemTheme : theme;
  return (
    <button onClick={() => setTheme(current === "dark" ? "light" : "dark")}>
      {current === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
