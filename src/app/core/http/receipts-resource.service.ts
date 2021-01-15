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
