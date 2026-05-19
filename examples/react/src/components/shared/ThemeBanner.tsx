import type { ExampleThemeId } from "../../lib/useVerdocsTheme";
import { ThemeToggle } from "./ThemeToggle";

interface ThemeBannerProps {
  themeId: ExampleThemeId;
  onChange: (themeId: ExampleThemeId) => void;
  variant?: "build" | "sign";
}

const themeLabel = (themeId: ExampleThemeId): string => {
  if (themeId === "default") {
    return "default";
  }
  if (themeId === "wayfair") {
    return "Wayfair";
  }
  return "Ironclad";
};

export const ThemeBanner = ({ themeId, onChange, variant = "build" }: ThemeBannerProps) => {
  const embedName = variant === "sign" ? "VerdocsSign" : "VerdocsBuild";
  const workflowLabel = variant === "sign" ? "signing experience" : "builder workflow";
  const isCustom = themeId !== "default";

  return (
    <aside
      className={`theme-banner ${isCustom ? "theme-banner--active" : "theme-banner--default"}`}
      aria-live="polite"
    >
      <div className="theme-banner-content">
        <div className="theme-banner-text">
          <p className="theme-banner-eyebrow">White-label styling</p>
          <h2 className="theme-banner-title">
            {isCustom
              ? `${themeLabel(themeId)} theme applied to ${embedName}`
              : "Compare default vs. custom branding"}
          </h2>
          <p className="theme-banner-description">
            Choose a preset to restyle buttons, fields, tabs, and signer colors across the {workflowLabel} below via{" "}
            <code>example-theme.css</code>.
          </p>
        </div>
        <ThemeToggle themeId={themeId} onChange={onChange} variant="prominent" />
      </div>
    </aside>
  );
};
