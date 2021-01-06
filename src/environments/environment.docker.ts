import { AppEnvironment } from './app-environment';

export const environment: AppEnvironment = {
  production: true,
  authUrl: 'PUT_AUTH_HOST_HERE',
  authRealm: 'PUT_AUTH_REALM_HERE',
  authClientId: 'PUT_AUTH_CLIENTID_HERE',
  managerUrl: 'PUT_MANAGER_URI_HERE',
  managerPrivateUrl: 'PUT_MANAGER_PRIVATE_URI_HERE',
  customization: {
    headerLogoUrl: 'PUT_HEADER_LOGO_URI_HERE',
    headerLogoStyle: 'PUT_HEADER_LOGO_STYLE_HERE',
    multipleInfo: 'PUT_MULTIPLE_HEADER_HERE' as any,
    multipleThemes: 'PUT_MULTIPLE_THEMES_HERE' as any,
    defaultLanguage: 'PUT_DEFAULT_LANGUAGE_HERE'
  }
};
