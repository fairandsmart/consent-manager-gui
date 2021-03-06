import {AppEnvironment} from './app-environment';
import {AddMultipleOption} from '../app/modules/admin/components/entries/entries-library/entries-library.component';

export const environment: AppEnvironment = {
  production: true,
  authUrl: 'http://localhost:8080/auth',
  authRealm: 'FairAndSmart',
  authClientId: 'consent-manager-gui',
  managerUrl: 'http://localhost:8087',
  managerPrivateUrl: 'http://localhost:8087',
  customization: {
    headerLogoUrl: 'https://assets.fairandsmart.tech/logo_fs_tagline.png',
    headerLogoStyle: 'height: 59px;',
    multipleInfo: AddMultipleOption.ENTERPRISE,
    defaultLanguage: 'fr'
  }
};
