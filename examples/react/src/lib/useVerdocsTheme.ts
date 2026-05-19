import { useEffect, useState } from "react";

export const VERDOCS_THEME_CLASS = "verdocs-custom-theme";

export type ExampleThemeId = "default" | "wayfair" | "ironclad";

const THEME_STORAGE_KEY = "verdocs-example-theme";

const isExampleThemeId = (value: string): value is ExampleThemeId =>
  value === "default" || value === "wayfair" || value === "ironclad";

const loadStoredTheme = (fallback: ExampleThemeId): ExampleThemeId => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && isExampleThemeId(stored)) {
      return stored;
    }
  } catch {
    /* ignore */
  }
  return fallback;
};

const applyThemeToDocument = (themeId: ExampleThemeId): void => {
  const root = document.documentElement;
  root.dataset.exampleTheme = themeId;
  root.classList.toggle(VERDOCS_THEME_CLASS, themeId !== "default");
};

export const useExampleTheme = (defaultTheme: ExampleThemeId = "wayfair") => {
  const [themeId, setThemeIdState] = useState<ExampleThemeId>(() => loadStoredTheme(defaultTheme));

  useEffect(() => {
    applyThemeToDocument(themeId);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch {
      /* ignore */
    }
  }, [themeId]);

  const setThemeId = (next: ExampleThemeId) => {
    setThemeIdState(next);
  };

  const isCustomTheme = themeId !== "default";

  return { themeId, setThemeId, isCustomTheme };
};

/** @deprecated Use useExampleTheme */
export const useVerdocsTheme = (defaultEnabled = true) => {
  const defaultTheme: ExampleThemeId = defaultEnabled ? "wayfair" : "default";
  const { themeId, setThemeId, isCustomTheme } = useExampleTheme(defaultTheme);

  return {
    enabled: isCustomTheme,
    setEnabled: (enabled: boolean) => setThemeId(enabled ? "wayfair" : "default"),
    toggle: () => setThemeId(themeId === "default" ? "wayfair" : "default"),
    themeId,
    setThemeId,
    isCustomTheme,
  };
};
