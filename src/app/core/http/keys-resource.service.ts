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
import { Key } from '../models/models';

@Injectable()
export class KeysResourceService {

  constructor(private http: HttpClient) {
  }

  listKeys(): Observable<Key[]> {
    return this.http.get<Key[]>(`${environment.managerUrl}/keys`);
  }

  createKey(name: string): Observable<Key> {
    return this.http.post<Key>(`${environment.managerUrl}/keys`, {name: name});
  }

  deleteKey(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.managerUrl}/keys/${id}`);
  }

}
