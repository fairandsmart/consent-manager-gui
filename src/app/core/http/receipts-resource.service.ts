import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReceiptsResourceService {

  readonly ROOT = `${environment.managerUrl}/receipts`;

  constructor(private http: HttpClient) {
  }

  getReceiptPdf(transactionId: string): Observable<ArrayBuffer> {
    // @ts-ignore
    return this.http.get<ArrayBuffer>(`${this.ROOT}/${transactionId}`, {params: {format: 'application/pdf'}, responseType: 'arraybuffer'});
  }

}
