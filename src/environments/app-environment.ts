export interface AppEnvironment {
  production: boolean;
  authUrl: string;
  authRealm: string;
  authClientId: string;
  managerUrl: string;
  customization: AppCustomization;
}

export interface AppCustomization {
  multipleHeader: boolean;
  multipleFooter: boolean;
  defaultLocale: string;
}
