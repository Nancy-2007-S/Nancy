"use client";
import React, { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(stored ? stored === "dark" : prefersDark);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  if (!mounted) return <div className="h-10 w-10" />;

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/50 p-2 text-slate-700 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-white dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:hover:bg-slate-700"
      aria-label="Toggle theme"
    >
      <div className="relative h-6 w-6">
        <FiSun
          className={`absolute inset-0 h-6 w-6 transform transition-all duration-500 ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <FiMoon
          className={`absolute inset-0 h-6 w-6 transform transition-all duration-500 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
    </button>
  );
}
