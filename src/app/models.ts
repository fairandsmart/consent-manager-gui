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
  type: string;
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
  order?: string;
  direction?: string;
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
  ARCHIVED = 'ARCHIVED',
}

export enum ModelVersionType {
  MAJOR = 'MAJOR',
  MINOR = 'MINOR'
}

export interface ConsentElementIdentifier {
  type: ModelDataType;
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
  thirdParties: {[key: string]: string};
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

export type ModelDataType = 'header' | 'treatment' | 'conditions' | 'footer';

export const MODEL_DATA_TYPES: ModelDataType[] = ['header', 'treatment', 'conditions', 'footer'];

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
  formType: ReceiptFormType;
  receiptDeliveryType: ReceiptDeliveryType;
  userinfos: { [key: string]: string };
  attributes: { [key: string]: string };
  optoutEmail: string;
  preview: boolean;
  iframe: boolean;
}

export enum ConsentFormOrientation {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL'
}

export enum ReceiptFormType {
  PARTIAL = 'PARTIAL',
  FULL = 'FULL'
}

export enum ReceiptDeliveryType {
  NONE = 'NONE',
  GENERATE = 'GENERATE',
  DISPLAY = 'DISPLAY',
  STORE = 'STORE',
  DOWNLOAD = 'DOWNLOAD'
}

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
  head: string;
  body: string;
  foot: string;
  value: string;
  status: RecordStatus;
  attributes: {[key: string]: string};
}

export interface RecordFilter {
  query?: string;
  page?: number;
  size?: number;
}
