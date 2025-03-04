import {VerdocsEndpoint} from '@verdocs/js-sdk';

export const BETA_ORIGINS = ['https://beta.verdocs.com', 'https://stage.verdocs.com', 'http://localhost:6006', 'http://localhost:5173'];

export const IS_BETA = BETA_ORIGINS.includes(window.location.origin);

export const API_URL = IS_BETA ? 'https://stage-api.verdocs.com' : 'https://api.verdocs.com';

export const DefaultEndpoint = VerdocsEndpoint.getDefault().setBaseURL(API_URL);
