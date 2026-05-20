import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ColorPalette } from "./ColorPalette";
import { ExampleThemeId } from "../../lib/useVerdocsTheme";

interface ColorPalleteAccordionProps {
  themeId: ExampleThemeId;
}

export const ColorPalleteAccordion: React.FC<ColorPalleteAccordionProps> = (props) => {
  const { themeId } = props;
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [themeRevision, setThemeRevision] = useState(0);

  useEffect(() => {
    setThemeRevision((r) => r + 1);
  }, [themeId]);

  return (
    <div className="theme-banner-palette">
      <button
        type="button"
        className="theme-banner-palette-trigger"
        aria-expanded={paletteOpen}
        aria-controls="theme-banner-palette-panel"
        onClick={() => setPaletteOpen((open) => !open)}
      >
        <span className="theme-banner-palette-trigger-label">Color palette</span>
        <ChevronDown
          className={`theme-banner-chevron ${paletteOpen ? "theme-banner-chevron--open" : ""}`}
          aria-hidden
          size={18}
          strokeWidth={2}
        />
      </button>
      <div
        id="theme-banner-palette-panel"
        className={`theme-banner-palette-panel ${paletteOpen ? "theme-banner-palette-panel--open" : ""}`}
      >
        <div className="theme-banner-palette-inner">
          <ColorPalette themeRevision={themeRevision} />
        </div>
      </div>
    </div>
  );
};
