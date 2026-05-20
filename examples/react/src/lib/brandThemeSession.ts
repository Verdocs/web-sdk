import { normalizeDomain } from "./submitBrandThemeFromDomain";

const BRAND_DOMAIN_KEY = "verdocs-example-brand-domain";

export const getBrandDomain = (): string | null => {
  try {
    const domain = localStorage.getItem(BRAND_DOMAIN_KEY);
    return domain?.trim() ? domain.trim() : null;
  } catch {
    return null;
  }
};

export const setBrandDomain = (domain: string): void => {
  try {
    const normalized = normalizeDomain(domain);
    if (normalized) {
      localStorage.setItem(BRAND_DOMAIN_KEY, normalized);
    } else {
      localStorage.removeItem(BRAND_DOMAIN_KEY);
    }
  } catch {
    /* ignore */
  }
};

export const hasBrandTheme = (): boolean => Boolean(getBrandDomain());
