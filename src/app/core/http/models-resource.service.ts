/*-
 * #%L
 * Right Consents, a Universal Consents & Preferences Management Platform.
 * %%
 * Copyright (C) 2020 - 2021 Fair And Smart
 * %%
 * This file is part of Right Consents Community Edition.
 * 
 * Right Consents Community Edition is published by FAIR AND SMART under the
 * GNU GENERAL PUBLIC LICENCE Version 3 (GPLv3) and a set of additional terms.
 * 
 * For more information, please see the “LICENSE” and “LICENSE.FAIRANDSMART”
 * files, or see https://www.fairandsmart.com/opensource/.
 * #L%
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CollectionPage,
  CreateModelDto,
  ModelData,
  ModelEntryDto,
  ModelFilter,
  ModelVersionDto,
  ModelVersionDtoLight,
  ModelVersionStatus,
  ModelVersionType,
  PreviewDto,
  UpdateModelDto
} from '../models/models';

@Injectable()
export class ModelsResourceService {

  readonly ROOT = `${environment.managerUrl}/models`;
  readonly NEW_VERSION_UUID = '11111111-9999-1111-9999-111111111111';

  constructor(private http: HttpClient) {
  }

  listEntries(filter: ModelFilter): Observable<CollectionPage<ModelEntryDto>> {
    return this.http.get<CollectionPage<ModelEntryDto>>(`${this.ROOT}`, {params: filter as any});
  }

  createEntry(dto: CreateModelDto): Observable<ModelEntryDto> {
    return this.http.post<ModelEntryDto>(`${this.ROOT}`, dto);
  }

  getEntry(id: string): Observable<ModelEntryDto> {
    return this.http.get<ModelEntryDto>(`${this.ROOT}/${id}`);
  }

  updateEntry(id: string, dto: UpdateModelDto): Observable<ModelEntryDto> {
    return this.http.put<ModelEntryDto>(`${this.ROOT}/${id}`, dto);
  }

  listVersions<T extends ModelData = ModelData>(id: string): Observable<ModelVersionDtoLight<T>[]> {
    return this.http.get<ModelVersionDtoLight<T>[]>(`${this.ROOT}/${id}/versions`);
  }

  createVersion<T extends ModelData = ModelData>(id: string, dto: ModelVersionDto<T>): Observable<ModelVersionDto<T>> {
    return this.http.post<ModelVersionDto<T>>(`${this.ROOT}/${id}/versions`, dto);
  }

  getLatestVersion<T extends ModelData = ModelData>(id: string): Observable<ModelVersionDto<T>> {
    return this.http.get<ModelVersionDto<T>>(`${this.ROOT}/${id}/versions/latest`);
  }

  getActiveVersion<T extends ModelData = ModelData>(id: string): Observable<ModelVersionDto<T>> {
    return this.http.get<ModelVersionDto<T>>(`${this.ROOT}/${id}/versions/active`);
  }

  getVersion<T extends ModelData = ModelData>(id: string, versionId: string): Observable<ModelVersionDto<T>> {
    return this.http.get<ModelVersionDto<T>>(`${this.ROOT}/${id}/versions/${versionId}`);
  }

  updateVersion<T extends ModelData = ModelData>(id: string, versionId: string, dto: ModelVersionDto<T>): Observable<ModelVersionDto<T>> {
    return this.http.put<ModelVersionDto<T>>(`${this.ROOT}/${id}/versions/${versionId}`, dto);
  }

  updateVersionStatus<T extends ModelData = ModelData>(id: string, versionId: string, status: ModelVersionStatus)
    : Observable<ModelVersionDto<T>> {
    return this.http.put<ModelVersionDto<T>>(`${this.ROOT}/${id}/versions/${versionId}/status`, {status});
  }

  updateVersionType<T extends ModelData = ModelData>(id: string, versionId: string, type: ModelVersionType):
    Observable<ModelVersionDto<T>> {
    return this.http.put<ModelVersionDto<T>>(`${this.ROOT}/${id}/versions/${versionId}/type`, {type});
  }

  getVersionPreview(id: string, vid: string, dto: PreviewDto): Observable<string> {
    return this.http.post(`${this.ROOT}/${id}/versions/${vid}/preview`, dto, {responseType: 'text'});
  }

  deleteVersion(id: string, versionId: string): Observable<void> {
    return this.http.delete<void>(`${this.ROOT}/${id}/versions/${versionId}`);
  }

}
