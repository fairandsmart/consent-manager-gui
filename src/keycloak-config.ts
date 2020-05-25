import { KeycloakOptions } from 'keycloak-angular';
import { environment } from './environments/environment';

export const KEYCLOAK_CONFIG: KeycloakOptions = {
  config: {
    url: environment.authUrl,
    realm: environment.authRealm,
    clientId: environment.authClientId
  },
  initOptions: {
    onLoad: 'login-required',
    checkLoginIframe: true
  },
  enableBearerInterceptor: true,
  bearerExcludedUrls: [
    '/assets'
  ]
};
