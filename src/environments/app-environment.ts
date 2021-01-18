import {AddMultipleOption} from '../app/modules/admin/components/entries/entries-library/entries-library.component';

export interface AppEnvironment {
  production: boolean;
  authUrl: string;
  authRealm: string;
  authClientId: string;
  managerUrl: string;
  managerPrivateUrl: string; // used by code snippets if they run on a specific private network
  customization: AppCustomization;
}

export interface AppCustomization {
  headerLogoStyle: string;
  headerLogoUrl: string;
  multipleInfo: AddMultipleOption;
  defaultLanguage: 'fr' | 'en';
}
