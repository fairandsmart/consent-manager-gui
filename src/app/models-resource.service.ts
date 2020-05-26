import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {
  CollectionPage,
  ContentDto,
  CreateModelDto,
  ModelData,
  ModelEntry,
  ModelFilter,
  ModelVersion,
  ModelVersionStatus,
  ModelVersionType,
  UpdateModelDto
} from './models';

@Injectable({
  providedIn: 'root'
})
export class ModelsResourceService {

  constructor(private http: HttpClient) { }

  listEntries(filter: ModelFilter): Observable<CollectionPage<ModelEntry>> {
    return this.http.get<CollectionPage<ModelEntry>>(`${environment.managerUrl}/models`, {params: filter as any});
  }

  createEntry(dto: CreateModelDto): Observable<ModelEntry> {
    return this.http.post<ModelEntry>(`${environment.managerUrl}/models`, dto);
  }

  getEntry(id: string): Observable<ModelEntry> {
    return this.http.get<ModelEntry>(`${environment.managerUrl}/models/${id}`);
  }

  updateEntry(id: string, dto: UpdateModelDto): Observable<ModelEntry> {
    return this.http.put<ModelEntry>(`${environment.managerUrl}/models/${id}`, dto);
  }

  listVersions<T extends ModelData = ModelData>(id: string): Observable<ModelVersion<T>[]> {
    return this.http.get<ModelVersion<T>[]>(`${environment.managerUrl}/models/${id}/versions`);
  }

  createVersion<T extends ModelData = ModelData>(id: string, dto: ContentDto<T>): Observable<ModelVersion<T>> {
    return this.http.post<ModelVersion<T>>(`${environment.managerUrl}/models/${id}/versions`, dto);
  }

  getLatestVersion<T extends ModelData = ModelData>(id: string): Observable<ModelVersion<T>> {
    return this.http.get<ModelVersion<T>>(`${environment.managerUrl}/models/${id}/versions/latest`);
  }

  getActiveVersion<T extends ModelData = ModelData>(id: string): Observable<ModelVersion<T>> {
    return this.http.get<ModelVersion<T>>(`${environment.managerUrl}/models/${id}/versions/active`);
  }

  getVersion<T extends ModelData = ModelData>(id: string, versionId: string): Observable<ModelVersion<T>> {
    return this.http.get<ModelVersion<T>>(`${environment.managerUrl}/models/${id}/versions/${versionId}`);
  }

  updateVersion<T extends ModelData = ModelData>(id: string, versionId: string, dto: ContentDto<T>): Observable<ModelVersion<T>> {
    return this.http.put<ModelVersion<T>>(`${environment.managerUrl}/models/${id}/versions/${versionId}`, dto);
  }

  updateVersionStatus<T extends ModelData = ModelData>(id: string, versionId: string, status: ModelVersionStatus)
    : Observable<ModelVersion<T>> {
    return this.http.put<ModelVersion<T>>(`${environment.managerUrl}/models/${id}/versions/${versionId}/status`, status);
  }

  updateVersionType<T extends ModelData = ModelData>(id: string, versionId: string, type: ModelVersionType): Observable<ModelVersion<T>> {
    return this.http.put<ModelVersion<T>>(`${environment.managerUrl}/models/${id}/versions/${versionId}/type`, type);
  }

  deleteVersion(id: string, versionId: string): Observable<void> {
    return this.http.delete<void>(`${environment.managerUrl}/models/${id}/versions/${versionId}`);
  }

}
