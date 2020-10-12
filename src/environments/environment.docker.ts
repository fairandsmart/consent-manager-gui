import { AppEnvironment } from './app-environment';

export const environment: AppEnvironment = {
  production: true,
  authUrl: 'PUT_AUTH_HOST_HERE',
  authRealm: 'PUT_AUTH_REALM_HERE',
  authClientId: 'PUT_AUTH_CLIENTID_HERE',
  managerUrl: 'PUT_MANAGER_URI_HERE',
  customization: {
    multipleInfo: 'PUT_MULTIPLE_HEADER_HERE' as any,
    defaultLocale: 'PUT_DEFAULT_LANGUAGE_HERE'
  }
};
