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

export enum Icons {
  basicinfo = 'info',
  processing = 'check_box',
  preference = 'favorite',
  conditions = 'text_snippet',
  email = 'mail',
  theme = 'palette',
  cookies = 'local_offer',
  gettingStarted = 'help',
  collect = 'integration_instructions',
  interrogate = 'search',
  security = 'vpn_key',
  all = 'assignment_turned_in',
  subject = 'people'
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
  defaultLanguage?: string;
  availableLanguages?: string[];
  status?: ModelVersionStatus;
  type?: ModelVersionType;
  creationDate?: number;
  modificationDate?: number;
  identifier?: string;
}

export interface ModelVersionDto<T extends ModelData = ModelData> extends ModelVersionDtoLight {
  data: { [language: string]: T };
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
  company: string;
  info: string;
  address: string;
  email: string;
  phoneNumber: string;
}

export interface BasicInfo extends ModelData {
  type: 'basicinfo';
  title: string;
  header: string;
  footer: string;
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

export enum RetentionUnit {
  YEAR = 'YEAR',
  MONTH = 'MONTH',
  WEEK = 'WEEK'
}

export const RETENTION_UNITS = Object.keys(RetentionUnit);

export enum ProcessingPurpose {
  CONSENT_CORE_SERVICE = 'CONSENT_CORE_SERVICE',
  CONSENT_IMPROVED_SERVICE = 'CONSENT_IMPROVED_SERVICE',
  CONSENT_MARKETING = 'CONSENT_MARKETING',
  CONSENT_THIRD_PART_SHARING = 'CONSENT_THIRD_PART_SHARING',
  CONSENT_RESEARCH = 'CONSENT_RESEARCH'
}

export const PROCESSING_PURPOSES = Object.keys(ProcessingPurpose);

export interface RetentionInfo {
  label: string;
  value: number;
  unit: RetentionUnit;
  fullText: string;
}

export interface Processing extends ModelData {
  type: 'processing';
  title: string;
  data: string;
  retention: RetentionInfo;
  usage: string;
  purposes: ProcessingPurpose[];
  containsSensitiveData: boolean;
  containsMedicalData: boolean;
  dataController: Controller;
  showDataController: boolean;
  thirdParties: { name: string, value: string }[];
}

export enum PreferenceValueType {
  TOGGLE = 'TOGGLE',
  CHECKBOXES = 'CHECKBOXES',
  RADIO_BUTTONS = 'RADIO_BUTTONS',
  LIST_SINGLE = 'LIST_SINGLE',
  LIST_MULTI = 'LIST_MULTI',
  FREE_TEXT = 'FREE_TEXT'
}

export const PREFERENCE_VALUE_TYPES: PreferenceValueType[] = Object.keys(PreferenceValueType) as PreferenceValueType[];

export interface Preference extends ModelData {
  type: 'preference';
  label: string;
  description: string;
  options: string[];
  valueType: PreferenceValueType;
  includeDefault: boolean;
  defaultValues: string[];
  optional: boolean;
}

export interface Conditions extends ModelData {
  type: 'conditions';
  title: string;
  body: string;
  acceptLabel?: string;
  rejectLabel?: string;
}

export enum LogoPosition {
  LEFT = 'LEFT',
  CENTER = 'CENTER',
  RIGHT = 'RIGHT'
}

export const LOGO_POSITIONS = Object.keys(LogoPosition);

export interface Theme extends ModelData {
  type: 'theme';
  name: string;
  presentation: string;
  icon: string;
  css: string;
  logoPath?: string;
  logoAltText?: string;
  logoPosition?: LogoPosition;
}

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

export type ModelDataType = 'basicinfo' | 'processing' | 'conditions' | 'theme' | 'email' | 'preference';

export enum PreviewType {
  FORM = 'FORM',
  RECEIPT = 'RECEIPT',
  EMAIL = 'EMAIL'
}

export const PREVIEW_TYPES = Object.keys(PreviewType);

export interface PreviewDto {
  language: string;
  orientation: ConsentFormOrientation;
  data?: ModelData;
  previewType?: PreviewType;
}

export interface ModelFilter {
  types?: ModelDataType[];
  keys?: string[];
  page?: number;
  size?: number;
  order?: string;
  direction?: SortDirection;
}

/* Consents */

export interface ConsentContext {
  subject: string;
  orientation: ConsentFormOrientation;
  info: string;
  elements: string[];
  callback: string;
  language: string;
  validity?: string;
  formType: ConsentFormType;
  receiptDisplayType?: ReceiptDisplayType;
  userinfos: { [key: string]: string };
  attributes: { [key: string]: string };
  notificationModel: string;
  notificationRecipient: string;
  collectionMethod: CollectionMethod;
  author: string;
  preview: boolean;
  iframe: boolean;
  theme?: string;
  acceptAllVisible?: boolean;
  validityVisible?: boolean;
  acceptAllText?: string;
  footerOnTop?: boolean;
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
  OPERATOR = 'OPERATOR',
  EMAIL = 'EMAIL',
  RECEIPT = 'RECEIPT',
  USER_PAGE = 'USER_PAGE'
}

export type ReceiptDisplayType = 'HTML' | 'XML' | 'PDF' | 'TEXT';

export const RECEIPT_DISPLAY_TYPES: ReceiptDisplayType[] = ['HTML', 'XML', 'PDF', 'TEXT'];

export interface ConsentTransaction {
  subject: string;
  transaction: string;
  claims: {[key: string]: string};
}

/* Notification reports */

export enum NotificationReportStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  OPENED = 'OPENED',
  INVALID_RECIPIENT = 'INVALID_RECIPIENT',
  MAILBOX_FULL = 'MAILBOX_FULL',
  ERROR = 'ERROR',
  PENDING = 'PENDING',
  NONE = 'NONE'
}

export enum NotificationReportType {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  FCM = 'FCM',
  XMPP = 'XMPP',
  NONE = 'NONE'
}

export interface NotificationReport {
  transaction: string;
  creationTimestamp: number;
  status: NotificationReportStatus;
  type: NotificationReportType;
  explanation: string;
}

/* Records */

export enum RecordStatus {
  VALID = 'VALID',
  OBSOLETE = 'OBSOLETE',
  EXPIRED = 'EXPIRED',
  IRRELEVANT = 'IRRELEVANT',
  UNKNOWN = 'UNKNOWN'
}

export enum RecordStatusExplanation {
  LATEST_VALID = 'LATEST_VALID',
  OBSOLETE = 'OBSOLETE',
  EXPIRED = 'EXPIRED',
  INFO_SERIAL_ARCHIVED = 'INFO_SERIAL_ARCHIVED',
  BODY_SERIAL_ARCHIVED = 'BODY_SERIAL_ARCHIVED',
  NOT_COMMITTED = 'NOT_COMMITTED'
}

export interface RecordDto {
  serial: string;
  infoKey?: string;
  bodyKey: string;
  subject: string;
  creationTimestamp: number;
  expirationTimestamp: number;
  type: string;
  value: string;
  status: RecordStatus;
  statusExplanation: RecordStatusExplanation;
  collectionMethod: CollectionMethod;
  comment: string;
  transaction: string;
  notificationReports: NotificationReport[];
}

export interface RecordFilter {
  page?: number;
  size?: number;
  owner?: string;
  subject?: string;
  status?: RecordStatus[];
  infos?: string[];
  elements?: string[];
  collectionMethod?: string;
  after?: number;
  before?: number;
  value?: string;
  order?: string;
  direction?: SortDirection;
}

export interface RecordsMap {
  [key: string]: RecordDto[];
}

export interface Key {
  id?: string;
  name: string;
  key?: string;
  creationDate?: number;
  lastAccessDate?: number;
}

export interface EntryRecord {
  id: string;
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
  versionIndex: number;
}

export interface EntryRecordFilter extends ModelFilter {
  order: string;
  subject: string;
  before?: number;
  after?: number;
}

export interface OperatorLogElement {
  type: string;
  key: string;
  identifier: string;
  value: string;
}

export interface SubjectDto {
  id: string;
  name: string;
  emailAddress: string;
  creationTimestamp: number;
}

export interface ExtractionConfigCondition {
  key: string;
  value: string;
  regexpValue: boolean;
}

export interface ExtractionConfigDto {
  condition: ExtractionConfigCondition;
}

export interface ExtractionResultDto {
  subjectId: string;
  subjectName: string;
  subjectEmail: string;
  recordKey: string;
  recordSerial: string;
  recordValue: string;
}

export interface UserDto {
  username: string;
  admin: boolean;
  operator: boolean;
  roles: string[];
}

export interface SupportInfoDto {
  status: string;
  latestVersion: string;
  currentVersion: string;
}

export interface ClientConfigDto {
  userPageEnabled: boolean;
  userPageElements: string[];
}

/* Statistics */

export enum TimeScale {
  DAYS = 'DAYS',
  WEEKS = 'WEEKS',
  MONTHS = 'MONTHS'
}

export const TIME_SCALES: TimeScale[] = Object.keys(TimeScale) as TimeScale[];

export interface StatsDataSet {
  label: string;
  data: number[];
}

export interface StatsData {
  datasets: StatsDataSet[];
  labels: string[];
}

export interface StatsChart {
  [key: string]: StatsData;
}

export interface StatsBag {
  [key: string]: StatsChart;
}
