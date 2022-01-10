import {decode} from 'jsonwebtoken';
import {IActiveSession} from '@verdocs/js-sdk/Users/Types';
import {setAuthorization} from '@verdocs/js-sdk/HTTP/Transport';

// Decode an access token. Also upgrade some deprecated fields to easier-to-read values foir internal use
const decodeAccessToken = (token: string): IActiveSession | null => {
  const decoded = decode(token) as any;
  if (decoded) {
    if (decoded?.['https://verdocs.com/permissions']) {
      decoded.permissions = decoded['https://verdocs.com/permissions'];
      delete decoded['https://verdocs.com/permissions'];
    }
    if (decoded?.['https://verdocs.com/roles']) {
      decoded.roles = decoded['https://verdocs.com/roles'];
      delete decoded['https://verdocs.com/roles'];
    }
    if (decoded?.['https://verdocs.com/plans']) {
      decoded.plans = decoded['https://verdocs.com/plans'];
      delete decoded['https://verdocs.com/plans'];
    }
    if (decoded?.['https://verdocs.com/profile']) {
      decoded.profile = decoded['https://verdocs.com/profile'];
      delete decoded['https://verdocs.com/profile'];
    }
    if (decoded?.['https://verdocs.com/permissions']) {
      decoded.permissions = decoded['https://verdocs.com/permissions'];
      delete decoded['https://verdocs.com/permissions'];
    }
    if (decoded?.['https://verdocs.com/profile_id']) {
      decoded.profile_id = decoded['https://verdocs.com/profile_id'];
      delete decoded['https://verdocs.com/profile_id'];
    }
    if (decoded?.['https://verdocs.com/organization_id']) {
      decoded.organization_id = decoded['https://verdocs.com/organization_id'];
      delete decoded['https://verdocs.com/organization_id'];
    }

    return decoded as IActiveSession;
  }

  return null;
};

/**
 * Activate a session, optionally persisting it to localStorage.
 */
export const setSession = (source: string, token: string | null, persist: boolean): IActiveSession | null => {
  const session = decodeAccessToken(token);
  if (!session) {
    return null;
  }

  if (session.exp && session.exp * 1000 < new Date().getTime()) {
    localStorage.removeItem(source);
    return null;
  }

  if (persist) {
    localStorage.setItem(source, token);
  }

  setAuthorization(token);
  return session;
};

/**
 * Load a session from localStorage
 */
export const getSession = (source: string): IActiveSession | null => {
  const token = localStorage.getItem(source);
  if (!token) {
    return null;
  }

  const session = decodeAccessToken(token);
  if (!session) {
    return null;
  }

  if (session.exp && session.exp * 1000 < new Date().getTime()) {
    localStorage.removeItem(source);
    return null;
  }

  setAuthorization(token);
  return session;
};

/**
 * End the given session
 */
export const endSession = (source: string) => {
  setAuthorization(null);
  localStorage.removeItem(source);
};
