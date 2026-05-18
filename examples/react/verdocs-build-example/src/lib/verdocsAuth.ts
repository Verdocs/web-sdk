import {authenticate, VerdocsEndpoint} from '@verdocs/js-sdk';

export interface VerdocsCredentials {
  username: string;
  password: string;
}

export const authenticateVerdocs = async ({username, password}: VerdocsCredentials): Promise<void> => {
  const endpoint = VerdocsEndpoint.getDefault();
  const response = await authenticate(endpoint, {
    grant_type: 'password',
    username,
    password,
  });
  endpoint.setToken(response.access_token);
  endpoint.loadSession();
};

export const getCredentialsFromEnv = (): VerdocsCredentials | null => {
  const username = import.meta.env.VITE_VERDOCS_USERNAME;
  const password = import.meta.env.VITE_VERDOCS_PASSWORD;

  if (!username || !password) {
    return null;
  }

  return {username, password};
};

export const getInitialTemplateId = (): string | null => {
  const templateId = import.meta.env.VITE_VERDOCS_TEMPLATE_ID;
  return templateId?.trim() ? templateId.trim() : null;
};
