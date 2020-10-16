// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { AppEnvironment } from './app-environment';

export const environment: AppEnvironment = {
  production: false,
  authUrl: 'http://localhost:8080/auth',
  authRealm: 'FairAndSmart',
  authClientId: 'consent-manager-gui',
  managerUrl: 'http://localhost:8087',
  customization: {
    multipleInfo: false,
    defaultLocale: 'fr',
    displayUserPage: true,
    userPageElementsOrder: 'cbcfd77d-89fb-42d7-b030-221ca600271e,ecbd3161-e805-4c81-9779-cc7f455a525a,18bbbf26-4f45-44cb-9e91-8139f54dcc5c,329ce5d6-de03-4996-89e8-af2f984d8342'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
