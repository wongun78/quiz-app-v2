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
  effectiveTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (globalThis.window !== undefined) {
      return (localStorage.getItem("theme") as Theme) || "system";
    }
    return "system";
  });

  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(
    "light"
  );

  useEffect(() => {
    const root = globalThis.document.documentElement;
    const mediaQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      let resolvedTheme: "light" | "dark";

      if (theme === "system") {
        resolvedTheme = mediaQuery.matches ? "dark" : "light";
      } else {
        resolvedTheme = theme;
      }

      root.classList.remove("light", "dark");
      root.classList.add(resolvedTheme);
      setEffectiveTheme(resolvedTheme);
    };

    applyTheme();

    if (theme === "system") {
      mediaQuery.addEventListener("change", applyTheme);
      return () => mediaQuery.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  const updateTheme = (newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = effectiveTheme === "dark" ? "light" : "dark";
    updateTheme(nextTheme);
  };

  const contextValue = useMemo(
    () => ({ theme, effectiveTheme, setTheme: updateTheme, toggleTheme }),
    [theme, effectiveTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
