"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { t } from "@/i18n";

export type ThemePreference = "light" | "dark" | "system";
const KEY = "chess-academy:theme";

/**
 * Inline script that applies the theme before first paint (no flash).
 * Kept tiny and dependency-free on purpose.
 */
export const themeScript = `(function(){try{var p=localStorage.getItem("${KEY}")||"system";var d=p==="dark"||(p==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light";}catch(e){document.documentElement.dataset.theme="light";}})();`;

const listeners = new Set<() => void>();

function readPreference(): ThemePreference {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

function apply(preference: ThemePreference) {
  const dark =
    preference === "dark" || (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (readPreference() === "system") apply("system");
    listener();
  };
  media.addEventListener("change", onChange);
  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onChange);
  };
}

export function setThemePreference(preference: ThemePreference) {
  try {
    localStorage.setItem(KEY, preference);
  } catch {
    /* storage blocked: still apply for this visit */
  }
  apply(preference);
  for (const l of listeners) l();
}

export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(subscribe, readPreference, () => "system");
}

const OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: t.theme.light, icon: Sun },
  { value: "dark", label: t.theme.dark, icon: Moon },
  { value: "system", label: t.theme.system, icon: Monitor },
];

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const preference = useThemePreference();
  return (
    <div role="radiogroup" aria-label={t.theme.label} className="inline-flex rounded-lg border border-border bg-surface-2 p-0.5">
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={preference === value}
          title={label}
          onClick={() => setThemePreference(value)}
          className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors ${
            preference === value ? "bg-surface text-text shadow-card" : "text-muted hover:text-text"
          }`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {!compact && <span>{label}</span>}
          {compact && <span className="sr-only">{label}</span>}
        </button>
      ))}
    </div>
  );
}
