import type { ExampleThemeId } from "../../lib/useVerdocsTheme";

export const EXAMPLE_THEME_OPTIONS: { id: ExampleThemeId; label: string }[] = [
  { id: "default", label: "Verdocs default" },
  { id: "wayfair", label: "Wayfair (sample)" },
  { id: "ironclad", label: "Ironclad" },
  { id: "lingscars", label: "LINGsCARS" },
];

const THEME_SUBLABELS: Record<ExampleThemeId, string> = {
  default: "Stock Verdocs styling on embeds",
  wayfair: "Purple retail sample — maps CSS variables to the SDK",
  ironclad: "Green CLM brand — colors from ironclad.design",
  lingscars: "Car leasing — blue & magenta from lingscars.com",
};

interface ThemeToggleProps {
  themeId: ExampleThemeId;
  onChange: (themeId: ExampleThemeId) => void;
  variant?: "compact" | "prominent";
}

export const ThemeToggle = ({ themeId, onChange, variant = "compact" }: ThemeToggleProps) => {
  const selectId = variant === "prominent" ? "theme-select-prominent" : "theme-select-compact";

  return (
    <div className={`theme-select-wrap theme-select-wrap--${variant}`}>
      {variant === "prominent" && (
        <label className="theme-select-label" htmlFor={selectId}>
          <strong>Theme</strong>
        </label>
      )}
      <select
        id={selectId}
        className="theme-select"
        value={themeId}
        onChange={(e) => onChange(e.target.value as ExampleThemeId)}
        aria-label="White-label theme preset"
      >
        {EXAMPLE_THEME_OPTIONS.map(({ id, label }) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};
