"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (currentTheme: string) => {
      root.classList.remove("light", "dark");
      
      if (currentTheme === "SYSTEM") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(currentTheme.toLowerCase());
      }
    };

    applyTheme(theme);

    // Listen for system theme changes if in SYSTEM mode
    if (theme === "SYSTEM") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("SYSTEM");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return <>{children}</>;
}
