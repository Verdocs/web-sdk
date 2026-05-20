import { VerdocsEndpoint } from "@verdocs/js-sdk";

export const normalizeDomain = (raw: string): string => {
  let value = raw.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, "");
  value = value.replace(/^www\./, "");
  value = value.replace(/\/+$/, "");
  const slashIndex = value.indexOf("/");
  if (slashIndex !== -1) {
    value = value.slice(0, slashIndex);
  }
  return value;
};

export const validateBrandThemeDomain = (domain: string): string | undefined => {
  const normalized = normalizeDomain(domain);
  if (!normalized) {
    return "Please enter your company website.";
  }
  if (!normalized.includes(".")) {
    return "Please enter a valid website address (for example, yourcompany.com).";
  }
  if (!/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(normalized) && !/^[a-z0-9]+$/.test(normalized)) {
    return "Please enter a valid website address (for example, yourcompany.com).";
  }
  return undefined;
};

// TODO(js-sdk): add e.g. fetchBrandThemeFromDomain(endpoint, { domain }) for POST <route TBD>
// Returns theme tokens (or preset id) for applyExampleThemeFromApi(response)
export const submitBrandThemeFromDomain = async (domain: string): Promise<void> => {
  const endpoint = new VerdocsEndpoint();
  const normalized = normalizeDomain(domain);
  void endpoint;
  void normalized;
  // Stub: resolves until fetchBrandThemeFromDomain is added to @verdocs/js-sdk
};

export const getBrandThemeErrorMessage = (error: unknown): string => {
  const err = error as { response?: { data?: { error?: string } }; message?: string };
  return err.response?.data?.error ?? err.message ?? "We couldn't prepare your brand preview. Try again in a moment.";
};
