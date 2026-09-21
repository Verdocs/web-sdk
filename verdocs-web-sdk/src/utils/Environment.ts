import {VerdocsEndpoint} from '@verdocs/js-sdk';

export const BETA_ORIGINS = ['https://beta.verdocs.com', 'https://stage.verdocs.com', 'http://localhost:6006', 'http://localhost:5173'];

export const IS_BETA = BETA_ORIGINS.includes(window.location.origin);

export const API_URL = IS_BETA ? 'https://stage-api.verdocs.com' : 'https://api.verdocs.com';

// NOTE: Do not call setBaseURL(). The constructor already does, but more important, in most environments
// this particular code block is lazily loaded and gets run on a component render. That creates a race
// condition that silently overwrites a host-app preference and is hard to track down. (Definitely breaks
// the Teams app, among other things.)
export const DefaultEndpoint = VerdocsEndpoint.getDefault();

export const getWebAppUrl = (endpoint: VerdocsEndpoint = DefaultEndpoint) => (endpoint.getEnvironment() === 'beta' ? 'https://beta.verdocs.com' : 'https://app.verdocs.com');
