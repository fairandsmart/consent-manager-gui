/* Common */

export type SortDirection = 'asc' | 'desc' | '';

export const FIELD_VALIDATORS = {
  key: {
    pattern: '^[0-9a-zA-Z-_.]{2,255}$'
  },
  name: {
    min: 2,
    max: 255
  },
  description: {
    max: 2500
  },
  elementsKeys: {
    pattern: '^([0-9a-zA-Z-_.]{2,255},)*[0-9a-zA-Z-_.]{2,255}$'
  },
  phone: {
    pattern: '^\\+?[0-9]+$'
  }
};

export interface CollectionPage<T> {
  values: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

/* Models */

export interface ModelEntryDto {
  id: string;
  key: string;
  name: string;
  description: string;
  type: ModelDataType;
  versions: ModelVersionDtoLight[];
}

export interface CreateModelDto {
  key: string;
  name: string;
  description: string;
  type: ModelDataType;
}

export interface UpdateModelDto {
  name: string;
  description: string;
}

export interface ModelData {
  type: ModelDataType;
}

export interface ModelVersionDtoLight<T extends ModelData = ModelData> {
  id?: string;
  serial?: string;
  parent?: string;
  child?: string;
  author?: string;
  defaultLocale?: string;
  availableLocales?: string[];
  status?: ModelVersionStatus;
  type?: ModelVersionType;
  creationDate?: number;
  modificationDate?: number;
  identifier?: string;
}

export interface ModelVersionDto<T extends ModelData = ModelData> extends ModelVersionDtoLight {
  data: { [locale: string]: T };
}

export enum ModelVersionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export enum ModelVersionType {
  MAJOR = 'MAJOR',
  MINOR = 'MINOR'
}

export interface Controller {
  actingBehalfCompany: boolean;
  company: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
}

export interface Header extends ModelData {
  type: 'header';
  logoPath: string;
  logoAltText: string;
  title: string;
  body: string;
  jurisdiction: string;
  showJurisdiction: boolean;
  collectionMethod: string;
  showCollectionMethod: boolean;
  dataController: Controller;
  showDataController: boolean;
  scope: string;
  showScope: boolean;
  shortNoticeLink: string;
  showShortNoticeLink: boolean;
  privacyPolicyUrl: string;
  customPrivacyPolicyText: string;
}

export interface Footer extends ModelData {
  type: 'footer';
  body: string;
  showAcceptAll: boolean;
  customAcceptAllText: string;
}

export enum TreatmentPurpose {
  CONSENT_CORE_SERVICE = 'CONSENT_CORE_SERVICE',
  CONSENT_IMPROVED_SERVICE = 'CONSENT_IMPROVED_SERVICE',
  CONSENT_MARKETING = 'CONSENT_MARKETING',
  CONSENT_THIRD_PART_SHARING = 'CONSENT_THIRD_PART_SHARING',
  CONSENT_RESEARCH = 'CONSENT_RESEARCH'
}

export const TREATMENT_PURPOSES = Object.keys(TreatmentPurpose);

export interface Treatment extends ModelData {
  type: 'treatment';
  treatmentTitle: string;
  dataTitle: string;
  dataBody: string;
  retentionTitle: string;
  retentionBody: string;
  usageTitle: string;
  usageBody: string;
  purposes: TreatmentPurpose[];
  containsSensitiveData: boolean;
  containsMedicalData: boolean;
  dataController: Controller;
  showDataController: boolean;
  thirdParties: { name: string, value: string }[];
}

export interface Preference extends ModelData {
  type: 'preference';
  title: string;
  body: string;
}

export interface Conditions extends ModelData {
  type: 'conditions';
  title: string;
  body: string;
  acceptLabel: string;
  rejectLabel: string;
}

export interface Theme extends ModelData {
  type: 'theme';
  name: string;
  presentation: string;
  icon: string;
  css: string;
  targetType: TargetType;
}

export enum TargetType {
  FORM = 'FORM',
  EMAIL = 'EMAIL'
}

export const TARGET_TYPES = Object.keys(TargetType);

export interface Email extends ModelData {
  type: 'email';
  sender: string;
  subject: string;
  title: string;
  body: string;
  buttonLabel: string;
  footer: string;
  signature: string;
}

export type ModelDataType = 'header' | 'treatment' | 'conditions' | 'footer' | 'theme' | 'email' | 'preference';

export interface PreviewDto {
  locale: string;
  orientation: ConsentFormOrientation;
  data?: ModelData;
}

export interface ModelFilter {
  types: ModelDataType[];
  page?: number;
  size?: number;
  order?: string;
  direction?: SortDirection;
}

/* Consents */

export interface ConsentContext {
  subject: string;
  orientation: ConsentFormOrientation;
  header: string;
  elements: string[];
  footer: string;
  callback: string;
  locale: string;
  validity?: string;
  formType: ConsentFormType;
  receiptDeliveryType: ReceiptDeliveryType;
  userinfos: { [key: string]: string };
  attributes: { [key: string]: string };
  optoutModel: string;
  optoutRecipient: string;
  collectionMethod: CollectionMethod;
  author: string;
  preview: boolean;
  iframe: boolean;
  conditions?: boolean;
  theme?: string;
}

export enum ConsentFormOrientation {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL'
}

export const CONSENT_FORM_ORIENTATIONS: ConsentFormOrientation[] = Object.keys(ConsentFormOrientation) as ConsentFormOrientation[];

export enum ConsentFormType {
  PARTIAL = 'PARTIAL',
  FULL = 'FULL'
}

export enum CollectionMethod {
  WEBFORM = 'WEBFORM',
  OPERATOR = 'OPERATOR'
}

export type ReceiptDeliveryType = 'NONE' | 'GENERATE' | 'DISPLAY' | 'STORE' | 'DOWNLOAD';

export const RECEIPT_DELIVERY_TYPES: ReceiptDeliveryType[] = ['NONE', 'GENERATE', 'DISPLAY', 'STORE', 'DOWNLOAD'];

/* Records */

export enum RecordStatus {
  PENDING = 'PENDING',
  COMMITTED = 'COMMITTED',
  DELETED = 'DELETED',
  VALID = 'VALID',
  OBSOLETE = 'OBSOLETE',
  IRRELEVANT = 'IRRELEVANT'
}

export interface RecordDto {
  serial: string;
  headerKey?: string;
  bodyKey: string;
  footerKey?: string;
  subject: string;
  creationTimestamp: number;
  expirationTimestamp: number;
  type: string;
  value: string;
  status: RecordStatus;
  collectionMethod: CollectionMethod;
  comment: string;
}

export interface RecordFilter {
  page?: number;
  size?: number;
  owner?: string;
  subject?: string;
  status?: RecordStatus[];
  headers?: string[];
  elements?: string[];
  footers?: string[];
  collectionMethod?: string;
  after?: number;
  before?: number;
  value?: string;
  order?: string;
  direction?: SortDirection;
}

export interface Key {
  id?: string;
  name: string;
  key?: string;
  password?: string;
  creationDate?: number;
  lastAccessDate?: number;
}

export interface EntryRecord {
  key: string;
  type: string;
  name: string;
  identifier: string;
  value?: string;
  recordCreation?: number;
  recordExpiration?: number;
  comment?: string;
  collectionMethod?: CollectionMethod;
  status?: RecordStatus;
  active: boolean;
}

export interface EntryRecordFilter extends ModelFilter {
  order: string;
  subject: string;
  before?: number;
  after?: number;
}