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
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { HealthErrorComponent } from '../components/health-error/health-error.component';
import { environment } from '../../../environments/environment';

@Injectable()
export class HealthInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 0) {
          if (!error.url.startsWith(environment.managerUrl)) {
            console.error('[CONSENT-MANAGER] Peer service appears to be down...');
          } else if (!this.dialog.openDialogs.some(d => d.componentInstance instanceof HealthErrorComponent)) {
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
