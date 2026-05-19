import type { ExampleThemeId } from "./useVerdocsTheme";

export const getThemeBadgeLabel = (themeId: ExampleThemeId): string | null => {
  if (themeId === "default") {
    return null;
  }
  if (themeId === "wayfair") {
    return "wayfair";
  }
  return "ironclad";
};
