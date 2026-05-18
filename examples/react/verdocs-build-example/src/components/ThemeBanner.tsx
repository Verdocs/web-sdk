import {ThemeToggle} from './ThemeToggle';

interface ThemeBannerProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export const ThemeBanner = ({enabled, onChange}: ThemeBannerProps) => (
  <aside className={`theme-banner ${enabled ? 'theme-banner--active' : 'theme-banner--default'}`} aria-live="polite">
    <div className="theme-banner-content">
      <div className="theme-banner-text">
        <p className="theme-banner-eyebrow">White-label styling</p>
        <h2 className="theme-banner-title">
          {enabled ? 'Your brand theme is applied to VerdocsBuild' : 'Compare default vs. custom branding'}
        </h2>
        <p className="theme-banner-description">
          Toggle to see how CSS variables in <code>verdocs-custom-theme.css</code> restyle buttons, fields, tabs, and
          signer colors across the builder workflow below.
        </p>
      </div>
      <ThemeToggle enabled={enabled} onChange={onChange} variant="prominent" />
    </div>
    {enabled && (
      <div className="theme-banner-swatches" aria-hidden="true">
        <span className="theme-swatch" style={{background: 'var(--verdocs-primary-color, #0065ff)'}} title="Primary" />
        <span className="theme-swatch" style={{background: 'var(--signer-1-color, #13a10e)'}} title="Signer 1" />
        <span className="theme-swatch" style={{background: 'var(--signer-2-color, #021cc4)'}} title="Signer 2" />
        <span className="theme-swatch" style={{background: 'var(--signer-3-color, #a34ed4)'}} title="Signer 3" />
      </div>
    )}
  </aside>
);
