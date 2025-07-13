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
    bg: "bg-background",
    form: "bg-card border-border",
    button: "bg-primary hover:bg-primary/90 text-primary-foreground",
    accent: "accent-primary",
    label: "text-foreground",
  },
  oasis: {
    name: "Oasis",
    bg: "bg-background",
    form: "bg-card border-border",
    button: "bg-primary hover:bg-primary/90 text-primary-foreground",
    accent: "accent-primary",
    label: "text-foreground",
  },
  sunset: {
    name: "Sunset",
    bg: "bg-background",
    form: "bg-card border-border",
    button: "bg-primary hover:bg-primary/90 text-primary-foreground",
    accent: "accent-primary",
    label: "text-foreground",
  },
  midnight: {
    name: "Midnight",
    bg: "bg-background",
    form: "bg-card border-border",
    button: "bg-primary hover:bg-primary/90 text-primary-foreground",
    accent: "accent-primary",
    label: "text-foreground",
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