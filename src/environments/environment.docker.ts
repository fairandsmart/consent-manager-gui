import { AppEnvironment } from './app-environment';
import {AddMultipleOption} from '../app/modules/admin/components/entries/entries-library/entries-library.component';

export const environment: AppEnvironment = {
  production: true,
  authUrl: 'PUT_AUTH_HOST_HERE',
  authRealm: 'PUT_AUTH_REALM_HERE',
  authClientId: 'PUT_AUTH_CLIENTID_HERE',
  managerUrl: 'PUT_MANAGER_URI_HERE',
  managerPrivateUrl: 'PUT_MANAGER_PRIVATE_URI_HERE',
  catalogUrl: 'http://localhost:8191',
  customization: {
    headerLogoUrl: 'PUT_HEADER_LOGO_URI_HERE',
    headerLogoStyle: 'PUT_HEADER_LOGO_STYLE_HERE',
    multipleInfo: 'PUT_MULTIPLE_HEADER_HERE' as AddMultipleOption,
    defaultLanguage: 'PUT_DEFAULT_LANGUAGE_HERE'
  }
};
