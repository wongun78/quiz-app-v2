import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  effectiveTheme: "light" | "dark"; // The actual theme being applied
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Theme Provider Component
 * Manages dark/light theme state with localStorage persistence
 * Supports system preference detection
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme") as Theme;
    return stored || "system";
  });

  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(() => {
    if (theme === "system") {
      return globalThis.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  });

  useEffect(() => {
    const root = globalThis.document.documentElement;

    // Remove both classes first
    root.classList.remove("light", "dark");

    let currentTheme: "light" | "dark";

    if (theme === "system") {
      const systemTheme = globalThis.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      currentTheme = systemTheme;
    } else {
      currentTheme = theme;
    }

    root.classList.add(currentTheme);
    setEffectiveTheme(currentTheme);
  }, [theme]);

  // Listen to system theme changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      const root = globalThis.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
      setEffectiveTheme(newTheme);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    if (theme === "system") {
      // If system, toggle to opposite of current effective theme
      setTheme(effectiveTheme === "dark" ? "light" : "dark");
    } else {
      // Toggle between light and dark
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  const contextValue = useMemo(
    () => ({ theme, effectiveTheme, setTheme, toggleTheme }),
    [theme, effectiveTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access theme context
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};
