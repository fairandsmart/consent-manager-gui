import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGES } from './common/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public keycloak: KeycloakService,
    public translate: TranslateService
  ) {
    this.translate.addLangs(LANGUAGES);
    const browserLang = this.translate.getBrowserLang();
    const lang = this.translate.langs.includes(browserLang) ? browserLang : 'en';
    this.translate.use(lang);
  }
}
