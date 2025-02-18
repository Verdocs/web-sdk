import axios from 'axios';

const BETA_ORIGINS = ['https://beta.verdocs.com', 'https://stage.verdocs.com', 'http://localhost:6006', 'http://localhost:5173'];

const API_KEY = BETA_ORIGINS.includes(window.location.origin)
  ? 'default:development.6348f953f52485d19daf03992f2123a36e9eae59c5ca7f8736dc2b67'
  : 'default:production.4808a77b2a149e1796391b480b4fb501d73aa1e11123f60e07809ced';

export interface IFeatureFlags {
  toggles: {
    name: string; // 'on-call-featured'
    enabled: boolean;
    impressionData: boolean;
    variant: {
      name: string;
      enabled: boolean;
      feature_enabled: boolean;
      featureEnabled: boolean;
    };
  }[];
}

export const getFeatureFlags = () =>
  axios
    .get<IFeatureFlags>('https://unleash.verdocs.com/api/frontend', {
      headers: {
        Accept: 'application/json',
        Authorization: API_KEY,
      },
    })
    .then(r => r.data)
    .catch(e => {
      console.log('Unleash: Unable to fetch feature flags', e);
      throw e;
    });
