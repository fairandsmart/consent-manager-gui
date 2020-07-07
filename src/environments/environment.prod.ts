import { AppEnvironment } from './app-environment';

export const environment: AppEnvironment = {
  production: true,
  authUrl: 'http://localhost:8080/auth',
  authRealm: 'FairAndSmart',
  authClientId: 'gui-consent-manager',
  managerUrl: 'http://localhost:8087',
  customization: {
    multipleHeader: false,
    multipleFooter: false
  }
};
