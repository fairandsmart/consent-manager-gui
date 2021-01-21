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
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConsentContext } from '../models/models';

@Injectable()
export class ConsentsResourceService {

  readonly ROOT = `${environment.managerUrl}/consents`;

  constructor(private http: HttpClient) {
  }

  generateToken(ctx: ConsentContext): Observable<string> {
    return this.http.post(`${this.ROOT}/token`, ctx, {responseType: 'text'});
  }

  getFormUrl(token: string): string {
    return `${this.ROOT}?t=` + encodeURIComponent(token);
  }

  postConsent(values: HttpParams): Observable<string> {
    return this.http.post(`${this.ROOT}`, values.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      }, responseType: 'text'
    });
  }

}
