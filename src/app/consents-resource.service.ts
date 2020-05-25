import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface CollectionPage<T> {
  values: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

export interface ConsentElementEntry {
  id: Readonly<string>;
  version: Readonly<number>;
  type: string;
  key: string;
  name: string;
  description: string;
  owner: string;
  branches: string;
}

export interface ConsentElementEntryFilter {
  owner?: string;
  types: ConsentElementDataType[];
  page?: number;
  size?: number;
}

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

export interface CreateEntryDto {
  type: ConsentElementDataType;
  key: string;
  name: string;
  description: string;
}

export interface UpdateEntryDto {
  name: string;
  description: string;
}

export interface UpdateEntryContentDto {
  locale: string;
  content: ConsentElementData;
}

export interface UpdateEntryStatusDto {
  status: ConsentElementVersionStatus;
  revocation: ConsentElementVersionRevocation;
}

export interface ConsentElementData {
  type: ConsentElementDataType;
}

export enum ConsentElementVersionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum ConsentElementVersionRevocation {
  REQUIRED = 'REQUIRED',
  REFRESH = 'REFRESH',
  PRESERVE = 'PRESERVE'
}

export interface ConsentElementIdentifier {
  type: ConsentElementDataType;
  serial: string;
}

export interface ConsentElementContent<T extends ConsentElementData> {
  data: string;
  dataClass: string;
  modelData: T;
}

export interface ConsentElementVersion<T extends ConsentElementData = ConsentElementData> {
  id: string;
  version: number;
  entry: ConsentElementEntry;
  serial: string;
  parent: string;
  child: string;
  branches: string;
  owner: string;
  defaultLocale: string;
  availableLocales: string;
  status: ConsentElementVersionStatus;
  revocation: ConsentElementVersionRevocation;
  compatibility: string;
  creationDate: number;
  modificationDate: number;
  content: {[locale: string]: T};
  identifier: ConsentElementIdentifier;
}

export interface Header extends ConsentElementData {
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

export type HeaderVersion = ConsentElementVersion<Header>;

export interface Footer extends ConsentElementData {
  type: 'footer';
  body: string;
  showAcceptAll: boolean;
  customAcceptAllText: string;
}

export type FooterVersion = ConsentElementVersion<Footer>;

export interface Controller {
  actingBehalfCompany: boolean;
  company: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
}

export type ConsentElementDataType = 'header' | 'treatment' | 'conditions' | 'footer';

export const CONSENT_ELEMENT_DATA_TYPES: ConsentElementDataType[] = ['header', 'treatment', 'conditions', 'footer'];

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
  userinfos: {[key: string]: string};
  attributes: {[key: string]: string};
  optoutEmail: string;
  preview: boolean;
  iframe: boolean;
}

export enum ConsentFormOrientation {
  HORIZONTAL,
  VERTICAL
}

export enum ReceiptFormType {
  PARTIAL,
  FULL
}

export enum ReceiptDeliveryType {
  NONE,
  GENERATE,
  DISPLAY,
  STORE,
  DOWNLOAD
}

@Injectable({
  providedIn: 'root'
})
export class ConsentsResourceService {

  constructor(private http: HttpClient) { }

  listEntries(filter: ConsentElementEntryFilter): Observable<CollectionPage<ConsentElementEntry>> {
    return this.http.get<CollectionPage<ConsentElementEntry>>(`${environment.managerUrl}/consents/entries`, {params: filter as any});
  }

  createEntry(dto: CreateEntryDto): Observable<ConsentElementEntry> {
    return this.http.post<ConsentElementEntry>(`${environment.managerUrl}/consents/entries`, dto);
  }

  getEntry(id: string): Observable<ConsentElementEntry> {
    return this.http.get<ConsentElementEntry>(`${environment.managerUrl}/consents/entries/${id}`);
  }

  updateEntry(id: string, dto: UpdateEntryDto): Observable<ConsentElementEntry> {
    return this.http.put<ConsentElementEntry>(`${environment.managerUrl}/consents/entries/${id}`, dto);
  }

  getEntryContent<T extends ConsentElementData = ConsentElementData>(id: string): Observable<ConsentElementVersion<T>> {
    return this.http.get<ConsentElementVersion<T>>(`${environment.managerUrl}/consents/entries/${id}/content`);
  }

  updateEntryContent<T extends ConsentElementData = ConsentElementData>(id: string, dto: UpdateEntryContentDto)
    : Observable<ConsentElementVersion<T>> {
    return this.http.put<ConsentElementVersion<T>>(`${environment.managerUrl}/consents/entries/${id}/content`, dto);
  }

  updateEntryStatus(id: string, dto: UpdateEntryStatusDto): Observable<void> {
    return this.http.put<void>(`${environment.managerUrl}/consents/entries/${id}/status`, dto);
  }

  listEntryVersions<T extends ConsentElementData = ConsentElementData>(id: string): Observable<ConsentElementVersion<T>[]> {
    return this.http.get<ConsentElementVersion<T>[]>(`${environment.managerUrl}/consents/entries/${id}/versions`);
  }

  generateToken(ctx: ConsentContext): Observable<string> {
    return this.http.post<string>(`${environment.managerUrl}/consents/token`, ctx);
  }

}
