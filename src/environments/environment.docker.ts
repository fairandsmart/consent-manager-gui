import { AppEnvironment } from './app-environment';

export const environment: AppEnvironment = {
  production: true,
  authUrl: 'PUT_AUTH_HOST_HERE',
  authRealm: 'PUT_AUTH_REALM_HERE',
  authClientId: 'PUT_AUTH_CLIENTID_HERE',
  managerUrl: 'PUT_MANAGER_URI_HERE',
  customization: {
    multipleInfo: 'PUT_MULTIPLE_HEADER_HERE' as any,
    defaultLanguage: 'PUT_DEFAULT_LANGUAGE_HERE',
    displayUserPage: 'PUT_USER_PAGE_HERE' as any,
    userPageElementsOrder: 'PUT_KEYS_SEPARATED_WITH_COMMAS_HERE'
  }
};
