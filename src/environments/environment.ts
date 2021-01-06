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
  managerPrivateUrl: 'http://localhost:8087',
  customization: {
    headerLogoUrl: 'https://assets.fairandsmart.tech/logo_fs_tagline.png',
    headerLogoStyle: 'height: 59px;',
    multipleInfo: false,
    multipleThemes: false,
    defaultLanguage: 'fr'
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
