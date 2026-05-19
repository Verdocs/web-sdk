import {ThemeToggle} from './ThemeToggle';

interface ThemeBannerProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  variant?: 'build' | 'sign';
}

export const ThemeBanner = ({enabled, onChange, variant = 'build'}: ThemeBannerProps) => {
  const embedName = variant === 'sign' ? 'VerdocsSign' : 'VerdocsBuild';
  const workflowLabel = variant === 'sign' ? 'signing experience' : 'builder workflow';

  return (
    <aside className={`theme-banner ${enabled ? 'theme-banner--active' : 'theme-banner--default'}`} aria-live="polite">
      <div className="theme-banner-content">
        <div className="theme-banner-text">
          <p className="theme-banner-eyebrow">White-label styling</p>
          <h2 className="theme-banner-title">
            {enabled ? `Your brand theme is applied to ${embedName}` : 'Compare default vs. custom branding'}
          </h2>
          <p className="theme-banner-description">
            Toggle to see how CSS variables in <code>example-theme.css</code> restyle buttons, fields, tabs, and signer
            colors across the {workflowLabel} below.
          </p>
        </div>
        <ThemeToggle enabled={enabled} onChange={onChange} variant="prominent" />
      </div>
    </aside>
  );
};
