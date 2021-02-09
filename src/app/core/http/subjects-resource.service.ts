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
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RecordsMap, SubjectDto } from '../models/models';

@Injectable()
export class SubjectsResourceService {

  readonly ROOT = `${environment.managerUrl}/subjects`;

  constructor(private http: HttpClient) {
  }

  listSubjects(name: string): Observable<SubjectDto[]> {
    return this.http.get<SubjectDto[]>(`${this.ROOT}`, {params: {name: name}});
  }

  getSubject(name: string): Observable<SubjectDto> {
    return this.http.get<SubjectDto>(`${this.ROOT}/${name}`);
  }

  createSubject(subject: SubjectDto): Observable<SubjectDto> {
    return this.http.post<SubjectDto>(`${this.ROOT}`, subject);
  }

  updateSubject(subject: SubjectDto): Observable<SubjectDto> {
    return this.http.put<SubjectDto>(`${this.ROOT}/${subject.id}`, subject);
  }

  listSubjectRecords(subject: string): Observable<RecordsMap> {
    return this.http.get<RecordsMap>(`${this.ROOT}/${subject}/records`);
  }

}
