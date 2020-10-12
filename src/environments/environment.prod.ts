import { AppEnvironment } from './app-environment';

export const environment: AppEnvironment = {
  production: true,
  authUrl: 'http://localhost:8080/auth',
  authRealm: 'FairAndSmart',
  authClientId: 'consent-manager-gui',
  managerUrl: 'http://localhost:8087',
  customization: {
    multipleInfo: false,
    defaultLocale: 'fr'
  }
};
