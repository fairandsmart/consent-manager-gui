import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18N_DEFAULT_LANGUAGE, I18N_LANGUAGES } from './core/constants/i18n';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private translate: TranslateService) {
    this.i18nInitialisation();
  }

  i18nInitialisation(): void {
    this.translate.addLangs(I18N_LANGUAGES);
    const browserLang = this.translate.getBrowserLang();
    const lang = this.translate.langs.includes(browserLang) ? browserLang : I18N_DEFAULT_LANGUAGE;
    this.translate.use(lang);
  }

}
