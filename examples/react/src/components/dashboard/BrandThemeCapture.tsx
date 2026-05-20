import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setBrandDomain } from "../../lib/brandThemeSession";
import {
  normalizeDomain,
  submitBrandThemeFromDomain,
  validateBrandThemeDomain,
} from "../../lib/submitBrandThemeFromDomain";

interface BrandThemeCaptureProps {}

const GENERIC_ERROR = "We couldn't prepare your brand preview. Try again in a moment.";
const LOADING_DELAY_MS = 8000;

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

export const BrandThemeCapture = (_props: BrandThemeCaptureProps) => {
  const navigate = useNavigate();
  const mountedRef = useRef(true);
  const [domain, setDomain] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateBrandThemeDomain(domain);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setLoading(true);
    setError(null);

    try {
      const normalized = normalizeDomain(domain);
      await submitBrandThemeFromDomain(normalized);
      setBrandDomain(normalized);
      await delay(LOADING_DELAY_MS);
      if (mountedRef.current) {
        navigate("/dashboard", { replace: true });
      }
    } catch {
      if (mountedRef.current) {
        setError(GENERIC_ERROR);
        setLoading(false);
      }
    } finally {
      if (mountedRef.current) {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <aside className="dashboard-brand-theme">
        <p className="auth-loading">Loading...</p>
      </aside>
    );
  }

  return (
    <aside className="dashboard-brand-theme">
      <div className="dashboard-brand-theme-copy">
        <h2 className="dashboard-brand-theme-title">See agreements in your brand</h2>
        <p className="dashboard-brand-theme-subline">
          Enter your company website. We&apos;ll pull your colors and styling so the demos look and feel like your
          product—not a generic template.
        </p>
      </div>
      <form className="dashboard-brand-theme-form" onSubmit={handleSubmit} noValidate>
        <div className="dashboard-brand-theme-field">
          <label className="dashboard-brand-theme-label" htmlFor="brand-theme-domain">
            Company website
          </label>
          <input
            id="brand-theme-domain"
            className="dashboard-brand-theme-input"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="yourcompany.com"
            value={domain}
            onChange={(e) => {
              setDomain(e.target.value);
              setError(null);
            }}
            disabled={submitting}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "brand-theme-domain-error" : undefined}
          />
          {error && (
            <span id="brand-theme-domain-error" className="dashboard-brand-theme-error" role="alert">
              {error}
            </span>
          )}
        </div>
        <button type="submit" className="dashboard-brand-theme-submit" disabled={submitting}>
          {submitting ? "Preparing your brand…" : "Preview my brand"}
        </button>
      </form>
    </aside>
  );
};
