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
import { ConsentTransaction } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ReceiptsResourceService {

  readonly ROOT = `${environment.managerUrl}/receipts`;

  constructor(private http: HttpClient) {
  }

  generateReceiptToken(transaction: ConsentTransaction): Observable<string> {
    return this.http.post(`${this.ROOT}/token`, transaction, {responseType: 'text'});
  }

  getReceiptPdf(token: string, transactionId: string): Observable<ArrayBuffer> {
    return this.http.get<ArrayBuffer>(`${this.ROOT}/${transactionId}`, {
      params: {t: token, format: 'application/pdf'},
      // @ts-ignore
      responseType: 'arraybuffer'
    });
  }

}
