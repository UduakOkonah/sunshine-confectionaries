import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-yellow-300 dark:hover:bg-slate-700"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default ThemeToggle;