"use client";
import React, { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
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

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed right-6 bottom-6 z-[9999] flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-700 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-700/90"
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
