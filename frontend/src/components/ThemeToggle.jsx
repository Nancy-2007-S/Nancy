import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage or system preference
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    console.log("ThemeToggle: Changing theme to", isDark ? "dark" : "light");
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    console.log("HTML classes:", root.classList.toString());
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed right-6 top-6 z-[9999] flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 p-2 text-slate-700 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-700/80"
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
