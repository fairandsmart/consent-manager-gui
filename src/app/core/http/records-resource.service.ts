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
import { ExtractionConfigDto, ExtractionResultDto, RecordsMap } from '../models/models';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RecordsResourceService {

  readonly ROOT = `${environment.managerUrl}/records`;

  constructor(private http: HttpClient) {
  }

  listCustomerRecords(subject: string): Observable<RecordsMap> {
    return this.http.get<RecordsMap>(`${this.ROOT}`, {params: {subject: subject}});
  }

  extractRecords(config: ExtractionConfigDto): Observable<ExtractionResultDto[]> {
    return this.http.post<ExtractionResultDto[]>(`${this.ROOT}/extraction`, config);
  }

  extractRecordsCsv(config: ExtractionConfigDto): Observable<string> {
    return this.http.post(`${this.ROOT}/extraction`, config, {
      headers: {
        Accept: 'text/csv'
      },
      responseType: 'text'
    });
  }

}
