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
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18N_DEFAULT_LANGUAGE, I18N_LANGUAGES } from './core/constants/i18n';
import { environment } from '../environments/environment';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { RcHttpClient, RcHttpClientConfig, RightConsents } from '@fairandsmart/consent-manager';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'cm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private translate: TranslateService, private http: HttpClient) {
    this.i18nInitialisation();
  }

  i18nInitialisation(): void {
    this.translate.addLangs(I18N_LANGUAGES);
    const browserLang = this.translate.getBrowserLang();
    const lang = this.translate.langs.includes(browserLang) ? browserLang : I18N_DEFAULT_LANGUAGE;
    this.translate.use(lang);
  }

}
