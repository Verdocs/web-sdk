interface ThemeToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  variant?: 'compact' | 'prominent';
}

export const ThemeToggle = ({enabled, onChange, variant = 'compact'}: ThemeToggleProps) => {
  const id = variant === 'prominent' ? 'theme-toggle-prominent' : 'theme-toggle-compact';

  return (
    <label className={`theme-toggle theme-toggle--${variant}`} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        role="switch"
        aria-checked={enabled}
        checked={enabled}
        onChange={e => onChange(e.target.checked)}
      />
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-thumb" />
      </span>
      <span className="theme-toggle-label">
        {variant === 'prominent' ? (
          <>
            <strong>Custom white-label theme</strong>
            <span className="theme-toggle-sublabel">
              {enabled ? 'Active — SDK uses your CSS variables' : 'Off — Verdocs default styling'}
            </span>
          </>
        ) : (
          'Custom theme'
        )}
      </span>
    </label>
  );
};
