import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {
  CollectionPage,
  CreateModelDto,
  ModelData,
  ModelEntryDto,
  ModelFilter,
  ModelVersionDto,
  ModelVersionDtoLight,
  ModelVersionType,
  PreviewDto,
  LivePreviewDto,
  UpdateModelDto
} from './models';

@Injectable({
  providedIn: 'root'
})
export class ModelsResourceService {

  constructor(private http: HttpClient) {
  }

  listEntries(filter: ModelFilter): Observable<CollectionPage<ModelEntryDto>> {
    return this.http.get<CollectionPage<ModelEntryDto>>(`${environment.managerUrl}/models`, {params: filter as any});
  }

  createEntry(dto: CreateModelDto): Observable<ModelEntryDto> {
    return this.http.post<ModelEntryDto>(`${environment.managerUrl}/models`, dto);
  }

  getEntry(id: string): Observable<ModelEntryDto> {
    return this.http.get<ModelEntryDto>(`${environment.managerUrl}/models/${id}`);
  }

  updateEntry(id: string, dto: UpdateModelDto): Observable<ModelEntryDto> {
    return this.http.put<ModelEntryDto>(`${environment.managerUrl}/models/${id}`, dto);
  }

  listVersions<T extends ModelData = ModelData>(id: string): Observable<ModelVersionDtoLight<T>[]> {
    return this.http.get<ModelVersionDtoLight<T>[]>(`${environment.managerUrl}/models/${id}/versions`);
  }

  createVersion<T extends ModelData = ModelData>(id: string, dto: ModelVersionDto<T>): Observable<ModelVersionDto<T>> {
    return this.http.post<ModelVersionDto<T>>(`${environment.managerUrl}/models/${id}/versions`, dto);
  }

  getLatestVersion<T extends ModelData = ModelData>(id: string): Observable<ModelVersionDto<T>> {
    return this.http.get<ModelVersionDto<T>>(`${environment.managerUrl}/models/${id}/versions/latest`);
  }

  getActiveVersion<T extends ModelData = ModelData>(id: string): Observable<ModelVersionDto<T>> {
    return this.http.get<ModelVersionDto<T>>(`${environment.managerUrl}/models/${id}/versions/active`);
  }

  getVersion<T extends ModelData = ModelData>(id: string, versionId: string): Observable<ModelVersionDto<T>> {
    return this.http.get<ModelVersionDto<T>>(`${environment.managerUrl}/models/${id}/versions/${versionId}`);
  }

  updateVersion<T extends ModelData = ModelData>(id: string, versionId: string, dto: ModelVersionDto<T>): Observable<ModelVersionDto<T>> {
    return this.http.put<ModelVersionDto<T>>(`${environment.managerUrl}/models/${id}/versions/${versionId}`, dto);
  }

  updateVersionStatus<T extends ModelData = ModelData>(id: string, versionId: string, dto: ModelVersionDto<T>)
    : Observable<ModelVersionDto<T>> {
    return this.http.put<ModelVersionDto<T>>(`${environment.managerUrl}/models/${id}/versions/${versionId}/status`, dto);
  }

  updateVersionType<T extends ModelData = ModelData>(id: string, versionId: string, type: ModelVersionType):
    Observable<ModelVersionDto<T>> {
    return this.http.put<ModelVersionDto<T>>(`${environment.managerUrl}/models/${id}/versions/${versionId}/type`, type);
  }

  getVersionPreview(id: string, vid: string, dto: PreviewDto): Observable<string> {
    return this.http.post(`${environment.managerUrl}/models/${id}/versions/${vid}/preview`, dto, {responseType: 'text'});
  }

  deleteVersion(id: string, versionId: string): Observable<void> {
    return this.http.delete<void>(`${environment.managerUrl}/models/${id}/versions/${versionId}`);
  }

  getLivePreview(dto: LivePreviewDto): Observable<string> {
    return this.http.post(`${environment.managerUrl}/models/preview`, dto, {responseType: 'text'});
  }

}
