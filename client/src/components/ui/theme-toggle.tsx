import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/contexts";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "icon" | "dropdown" | "buttons";
}

export const ThemeToggle = ({
  className,
  variant = "icon",
}: ThemeToggleProps) => {
  const { theme, setTheme, toggleTheme } = useTheme();

  if (variant === "icon") {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          "relative inline-flex  items-center justify-center rounded-md bg-transparent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        aria-label="Toggle theme"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  if (variant === "dropdown") {
    return (
      <div className={cn("relative inline-block min-w-[140px]", className)}>
        <div className="relative">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
            className="h-9 w-full appearance-none rounded-md border border-input bg-background px-3 py-1 pr-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="Select theme"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center opacity-50">
            {(() => {
              if (theme === "system") return <Monitor className="h-4 w-4" />;
              if (theme === "dark") return <Moon className="h-4 w-4" />;
              return <Sun className="h-4 w-4" />;
            })()}
          </div>
        </div>
      </div>
    );
  }

  const modes = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ] as const;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-input bg-background p-1",
        className,
      )}
    >
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = theme === mode.value;
        return (
          <button
            key={mode.value}
            onClick={() => setTheme(mode.value)}
            className={cn(
              "inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
              isActive
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
            )}
            aria-label={`${mode.label} theme`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
};
