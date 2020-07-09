import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { HealthErrorComponent } from './health-error.component';

@Injectable()
export class HealthInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 0) {
          if (!this.dialog.openDialogs.some(d => d.componentInstance instanceof HealthErrorComponent)) {
            console.error('[CONSENT-MANAGER] Service appears to be down...');
            this.dialog.open(HealthErrorComponent, {
              disableClose: true
            });
          }
        }
        return throwError(error);
      })
    );
  }
}
