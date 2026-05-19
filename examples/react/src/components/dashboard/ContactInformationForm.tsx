import { useState } from "react";
import {
  getCreateProfileErrorMessage,
  hasFieldErrors,
  submitCreateProfile,
  validateCreateProfileInput,
  type CreateProfileFieldErrors,
  type CreateProfileInput,
} from "../../lib/submitCreateProfile";

interface ContactInformationFormProps {
  onSuccess?: () => void;
}

const emptyInput = (): CreateProfileInput => ({
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  org_name: "",
  phone: "",
});

export const ContactInformationForm = ({ onSuccess }: ContactInformationFormProps) => {
  const [input, setInput] = useState<CreateProfileInput>(emptyInput);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<CreateProfileFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const updateField = <K extends keyof CreateProfileInput>(key: K, value: CreateProfileInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      delete next.form;
      return next;
    });
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateCreateProfileInput(input, confirmPassword);
    if (hasFieldErrors(errors)) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      await submitCreateProfile(input);
      setSucceeded(true);
      onSuccess?.();
    } catch (error) {
      setFormError(getCreateProfileErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (succeeded) {
    return (
      <div className="contact-form-success">
        <h3>Thank you</h3>
        <p>
          Your account has been created. Check your email to verify your address—we&apos;ll follow up with your
          Introduction Package, including this demo&apos;s source code and integration documentation.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {formError && (
        <p className="contact-form-error" role="alert">
          {formError}
        </p>
      )}

      <div className="contact-form-row">
        <div className="contact-form-field">
          <label htmlFor="contact-first-name">First name</label>
          <input
            id="contact-first-name"
            type="text"
            autoComplete="given-name"
            value={input.first_name}
            onChange={(e) => updateField("first_name", e.target.value)}
            disabled={submitting}
            aria-invalid={Boolean(fieldErrors.first_name)}
            aria-describedby={fieldErrors.first_name ? "contact-first-name-error" : undefined}
          />
          {fieldErrors.first_name && (
            <span id="contact-first-name-error" className="contact-form-field-error" role="alert">
              {fieldErrors.first_name}
            </span>
          )}
        </div>

        <div className="contact-form-field">
          <label htmlFor="contact-last-name">Last name</label>
          <input
            id="contact-last-name"
            type="text"
            autoComplete="family-name"
            value={input.last_name}
            onChange={(e) => updateField("last_name", e.target.value)}
            disabled={submitting}
            aria-invalid={Boolean(fieldErrors.last_name)}
            aria-describedby={fieldErrors.last_name ? "contact-last-name-error" : undefined}
          />
          {fieldErrors.last_name && (
            <span id="contact-last-name-error" className="contact-form-field-error" role="alert">
              {fieldErrors.last_name}
            </span>
          )}
        </div>
      </div>

      <div className="contact-form-field">
        <label htmlFor="contact-email">Work email</label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          value={input.email}
          onChange={(e) => updateField("email", e.target.value)}
          disabled={submitting}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
        />
        {fieldErrors.email && (
          <span id="contact-email-error" className="contact-form-field-error" role="alert">
            {fieldErrors.email}
          </span>
        )}
      </div>

      <div className="contact-form-field">
        <label htmlFor="contact-org-name">Organization</label>
        <input
          id="contact-org-name"
          type="text"
          autoComplete="organization"
          value={input.org_name}
          onChange={(e) => updateField("org_name", e.target.value)}
          disabled={submitting}
          aria-invalid={Boolean(fieldErrors.org_name)}
          aria-describedby={fieldErrors.org_name ? "contact-org-name-error" : undefined}
        />
        {fieldErrors.org_name && (
          <span id="contact-org-name-error" className="contact-form-field-error" role="alert">
            {fieldErrors.org_name}
          </span>
        )}
      </div>

      <div className="contact-form-field">
        <label htmlFor="contact-phone">Phone (optional)</label>
        <input
          id="contact-phone"
          type="tel"
          autoComplete="tel"
          value={input.phone ?? ""}
          onChange={(e) => updateField("phone", e.target.value)}
          disabled={submitting}
        />
      </div>

      <div className="contact-form-field">
        <label htmlFor="contact-password">Password</label>
        <input
          id="contact-password"
          type="password"
          autoComplete="new-password"
          value={input.password}
          onChange={(e) => updateField("password", e.target.value)}
          disabled={submitting}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? "contact-password-error" : undefined}
        />
        {fieldErrors.password && (
          <span id="contact-password-error" className="contact-form-field-error" role="alert">
            {fieldErrors.password}
          </span>
        )}
      </div>

      <div className="contact-form-field">
        <label htmlFor="contact-confirm-password">Confirm password</label>
        <input
          id="contact-confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setFieldErrors((prev) => {
              const next = { ...prev };
              delete next.confirmPassword;
              return next;
            });
          }}
          disabled={submitting}
          aria-invalid={Boolean(fieldErrors.confirmPassword)}
          aria-describedby={fieldErrors.confirmPassword ? "contact-confirm-password-error" : undefined}
        />
        {fieldErrors.confirmPassword && (
          <span id="contact-confirm-password-error" className="contact-form-field-error" role="alert">
            {fieldErrors.confirmPassword}
          </span>
        )}
      </div>

      <p className="contact-form-legal">
        By submitting, you agree to the{" "}
        <a href="https://verdocs.com/eula" target="_blank" rel="noreferrer">
          End User License Agreement
        </a>{" "}
        and{" "}
        <a href="https://verdocs.com/privacy-policy" target="_blank" rel="noreferrer">
          Privacy Policy
        </a>
        .
      </p>

      <div className="contact-form-actions">
        <button type="submit" className="contact-form-submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </div>
    </form>
  );
};
