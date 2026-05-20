import type { ExampleThemeId } from "../../lib/useVerdocsTheme";
import { ThemeToggle } from "./ThemeToggle";
import { ColorPalleteAccordion } from "./ColorPalleteAccordion";

interface ThemeBannerProps {
  themeId: ExampleThemeId;
  onChange: (themeId: ExampleThemeId) => void;
}

export const ThemeBanner = ({ themeId, onChange }: ThemeBannerProps) => {
  const isCustom = themeId !== "default";

  return (
    <aside className={`theme-banner ${isCustom ? "theme-banner--active" : "theme-banner--default"}`} aria-live="polite">
      <div className="theme-banner-content">
        <div className="theme-banner-text">
          <p className="theme-banner-eyebrow">Styling</p>
          <h2 className="theme-banner-title">Compare white-label branding</h2>
        </div>
        <ThemeToggle themeId={themeId} onChange={onChange} variant="prominent" />
      </div>
      <ColorPalleteAccordion themeId={themeId} />
    </aside>
  );
};
