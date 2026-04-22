import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { darkPalette, lightPalette, type AppPalette } from "./palette";

export type AppTheme = {
  colorScheme: "light" | "dark";
  colors: AppPalette;
};

const ThemeContext = createContext<AppTheme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const scheme = useColorScheme();
  const colorScheme = scheme === "dark" ? "dark" : "light";
  const value = useMemo<AppTheme>(
    () => ({
      colorScheme,
      colors: colorScheme === "dark" ? darkPalette : lightPalette,
    }),
    [colorScheme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): AppTheme {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }
  return ctx;
}
