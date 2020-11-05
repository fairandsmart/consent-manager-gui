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
  defaultLanguage: string;
  displayUserPage: boolean;
  userPageElementsOrder: string;
}
