import { useEffect, useState } from "react";

interface PaletteToken {
  name: string;
  cssVar: string;
}

const PALETTE_TOKENS: PaletteToken[] = [
  { name: "Primary", cssVar: "--example-color-primary" },
  { name: "Primary hover", cssVar: "--example-color-primary-hover" },
  { name: "Accent", cssVar: "--example-color-accent" },
  { name: "Surface", cssVar: "--example-color-surface" },
  { name: "Background", cssVar: "--example-color-bg" },
  { name: "Text", cssVar: "--example-color-text" },
  { name: "Muted", cssVar: "--example-color-muted" },
  { name: "Signer 1", cssVar: "--example-signer-1" },
  { name: "Signer 2", cssVar: "--example-signer-2" },
  { name: "Signer 3", cssVar: "--example-signer-3" },
  { name: "Signer 4", cssVar: "--example-signer-4" },
  { name: "Signer 5", cssVar: "--example-signer-5" },
];

const resolveHex = (cssVar: string): string => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  if (!raw) {
    return "—";
  }
  if (raw.startsWith("#")) {
    return raw;
  }
  const probe = document.createElement("span");
  probe.style.color = raw;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  const match = computed.match(/\d+/g);
  if (!match || match.length < 3) {
    return raw;
  }
  const [r, g, b] = match.map((n) => Number(n).toString(16).padStart(2, "0"));
  return `#${r}${g}${b}`;
};

interface ColorPaletteProps {
  themeRevision?: number;
}

export const ColorPalette = ({ themeRevision = 0 }: ColorPaletteProps) => {
  const [resolved, setResolved] = useState<Record<string, string>>({});

  useEffect(() => {
    const next: Record<string, string> = {};
    PALETTE_TOKENS.forEach(({ cssVar }) => {
      next[cssVar] = resolveHex(cssVar);
    });
    setResolved(next);
  }, [themeRevision]);

  return (
    <section className="color-palette" aria-label="Theme color palette">
      <div className="color-palette-grid">
        {PALETTE_TOKENS.map(({ name, cssVar }) => (
          <div key={cssVar} className={`color-palette-item`}>
            <span className="color-palette-swatch" style={{ background: `var(${cssVar})` }} title={name} />
            <div className="color-palette-meta">
              <span className="color-palette-name">{name}</span>
              <span className="color-palette-hex">{resolved[cssVar] ?? "…"}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
