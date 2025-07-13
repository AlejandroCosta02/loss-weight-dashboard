"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ThemeName = "aurora" | "oasis" | "sunset" | "midnight";

type ThemeConfig = {
  name: string;
  bg: string;
  form: string;
  button: string;
  accent: string;
  label: string;
};

export const themes: Record<ThemeName, ThemeConfig> = {
  aurora: {
    name: "Aurora",
    bg: "bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100",
    form: "bg-white/90 border-pink-200",
    button: "bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white",
    accent: "accent-pink-500",
    label: "text-pink-600",
  },
  oasis: {
    name: "Oasis",
    bg: "bg-gradient-to-br from-green-100 via-cyan-100 to-blue-200",
    form: "bg-white/90 border-emerald-200",
    button: "bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 hover:from-green-500 hover:to-blue-600 text-white",
    accent: "accent-green-500",
    label: "text-emerald-600",
  },
  sunset: {
    name: "Sunset",
    bg: "bg-gradient-to-br from-orange-100 via-pink-200 to-purple-200",
    form: "bg-white/90 border-orange-200",
    button: "bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 hover:from-orange-500 hover:to-purple-700 text-white",
    accent: "accent-orange-500",
    label: "text-orange-600",
  },
  midnight: {
    name: "Midnight",
    bg: "bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900",
    form: "bg-gray-900/90 border-indigo-800",
    button: "bg-gradient-to-r from-indigo-700 via-blue-800 to-gray-900 hover:from-indigo-800 hover:to-gray-800 text-white",
    accent: "accent-indigo-500",
    label: "text-indigo-300",
  },
};

interface ThemeContextProps {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextProps>({ theme: "aurora", setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>("aurora");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (stored && themes[stored as ThemeName]) setTheme(stored as ThemeName);
  }, []);

  const changeTheme = (t: ThemeName) => {
    setTheme(t);
    if (typeof window !== "undefined") localStorage.setItem("theme", t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
} 