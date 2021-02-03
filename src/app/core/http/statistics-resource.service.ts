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
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatsBag } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class StatisticsResourceService {

  readonly ROOT = `${environment.managerUrl}/stats`;

  constructor(private http: HttpClient) {
  }

  getStats(): Observable<StatsBag> {
    return this.http.get<StatsBag>(`${this.ROOT}`);
  }

}
