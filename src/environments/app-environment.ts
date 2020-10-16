export interface AppEnvironment {
  production: boolean;
  authUrl: string;
  authRealm: string;
  authClientId: string;
  managerUrl: string;
  customization: AppCustomization;
}

export interface AppCustomization {
  multipleInfo: boolean;
  defaultLocale: string;
  displayUserPage: boolean;
  userPageElementsOrder: string;
}
