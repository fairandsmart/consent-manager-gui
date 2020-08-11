export interface CollectionPage<T> {
  values: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

export interface ModelEntry {
  id: string;
  version: number;
  type: ModelDataType;
  key: string;
  name: string;
  description: string;
  owner: string;
  branches: string;
}

export interface ModelFilter {
  types: ModelDataType[];
  page?: number;
  size?: number;
  order?: keyof ModelEntry;
  direction?: SortDirection;
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

export enum ModelVersionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export enum ModelVersionType {
  MAJOR = 'MAJOR',
  MINOR = 'MINOR'
}

export interface ConsentElementIdentifier {
  type: ModelDataType;
  key: string;
  serial: string;
}

export interface ModelContent<T extends ModelData> {
  data: string;
  dataClass: string;
  dataObject: T;
  author: string;
}

export interface ContentDto<T extends ModelData = ModelData> {
  locale: string;
  content: T;
}

export interface ModelVersion<T extends ModelData = ModelData> {
  id: string;
  version: number;
  entry: ModelEntry;
  serial: string;
  parent: string;
  child: string;
  branches: string;
  owner: string;
  defaultLocale: string;
  availableLocales: string;
  status: ModelVersionStatus;
  type: ModelVersionType;
  counterparts: string;
  creationDate: number;
  modificationDate: number;
  content: { [locale: string]: ModelContent<T> };
  identifier: ConsentElementIdentifier;
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

export interface Conditions extends ModelData {
  type: 'conditions';
  title: string;
  body: string;
  acceptLabel: string;
  rejectLabel: string;
}

export interface Controller {
  actingBehalfCompany: boolean;
  company: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
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
  EMAIL_OPT_OUT = 'EMAIL_OPT_OUT'
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

export type ModelDataType = 'header' | 'treatment' | 'conditions' | 'footer' | 'theme' | 'email';

export const MODEL_DATA_TYPES: ModelDataType[] = ['header', 'treatment', 'conditions', 'footer'];

export const MODEL_DATA_TYPES_COMPLETE: ModelDataType[] = ['header', 'treatment', 'conditions', 'footer', 'theme', 'email'];

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
  }
};

export interface ConsentContext {
  subject: string;
  owner: string;
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

export const CONSENT_FORM_TYPES: ConsentFormType[] = Object.keys(ConsentFormType) as ConsentFormType[];

export enum CollectionMethod {
  WEBFORM = 'WEBFORM',
  OPERATOR = 'OPERATOR'
}

export type ReceiptDeliveryType = 'NONE' | 'GENERATE' | 'DISPLAY' | 'STORE' | 'DOWNLOAD';

export const RECEIPT_DELIVERY_TYPES: ReceiptDeliveryType[] = ['NONE', 'GENERATE', 'DISPLAY', 'STORE', 'DOWNLOAD'];

export enum RecordStatus {
  PENDING = 'PENDING',
  COMMITTED = 'COMMITTED',
  EXPIRED = 'EXPIRED'
}

export interface Record {
  id: string;
  version: number;
  creationTimestamp: number;
  expirationTimestamp: number;
  owner: string;
  subject: string;
  transaction: string;
  parent: string;
  serial: string;
  type: string;
  headSerial: string;
  bodySerial: string;
  footSerial: string;
  headKey: string;
  bodyKey: string;
  footKey: string;
  value: string;
  status: RecordStatus;
  attributes: {[key: string]: string};
}

export interface RecordFilter {
  query?: string;
  page?: number;
  size?: number;
  order?: keyof Record;
  direction?: SortDirection;
}

export interface UserRecord {
  headerKey: string;
  bodyKey: string;
  footerKey: string;
  owner: string;
  subject: string;
  creationTimestamp: number;
  expirationTimestamp: number;
  type: string;
  value: string;
  status: string;
  collectionMethod: CollectionMethod;
  comment: string;
}

export interface UserRecordFilter {
  user?: string;
  page?: number;
  size?: number;
  order?: string;
  direction?: SortDirection;
}

export interface OperatorRecordDto {
  token: string;
  values: {[key: string]: string};
  comment: string;
}

export interface OperatorRecordElement {
  bodyKey: string;
  value: string;
}
