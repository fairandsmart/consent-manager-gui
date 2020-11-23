import { AppEnvironment } from './app-environment';

export const environment: AppEnvironment = {
  production: true,
  authUrl: 'http://localhost:8080/auth',
  authRealm: 'FairAndSmart',
  authClientId: 'consent-manager-gui',
  managerUrl: 'http://localhost:8087',
  customization: {
    headerLogoUrl: 'https://assets.fairandsmart.tech/logo_fs_tagline.png',
    headerLogoStyle: 'height: 59px;',
    multipleInfo: false,
    defaultLanguage: 'fr',
    displayUserPage: true,
    userPageElementsOrder: 'Core.1,Market.1,Channel.1,Frequency.1,Mode.1,Username.1,cgu.1'
  }
};
