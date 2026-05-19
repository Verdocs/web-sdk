import {VerdocsEndpoint} from '@verdocs/js-sdk';

const TEMPLATE_ID_KEY = 'verdocs-example-last-template-id';

export const loadBuilderSession = (): void => {
  VerdocsEndpoint.getDefault().loadSession();
};

export const hasBuilderSession = (): boolean => {
  const endpoint = VerdocsEndpoint.getDefault();
  return Boolean(endpoint.session);
};

export const clearBuilderSession = (): void => {
  VerdocsEndpoint.getDefault().clearSession();
};

export const subscribeToSession = (listener: (authenticated: boolean) => void): (() => void) => {
  const endpoint = VerdocsEndpoint.getDefault();
  return endpoint.onSessionChanged((_ep, session) => {
    listener(Boolean(session));
  });
};

export const loadStoredTemplateId = (): string | null => {
  try {
    const id = localStorage.getItem(TEMPLATE_ID_KEY);
    return id?.trim() ? id.trim() : null;
  } catch {
    return null;
  }
};

export const saveStoredTemplateId = (templateId: string | null): void => {
  try {
    if (templateId?.trim()) {
      localStorage.setItem(TEMPLATE_ID_KEY, templateId.trim());
    } else {
      localStorage.removeItem(TEMPLATE_ID_KEY);
    }
  } catch {
    /* ignore */
  }
};
