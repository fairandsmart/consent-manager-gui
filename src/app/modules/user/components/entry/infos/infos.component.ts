import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Information, ModelVersionDto } from '@fairandsmart/consent-manager/models';
import { ConfigService } from '../../../../../core/services/config.service';

@Component({
  selector: 'cm-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.scss']
})
export class InfosComponent implements OnInit {

  @Input()
  infoVersion: ModelVersionDto;

  defaultLanguage: string;
  infos: Information;

  get currentLang(): string {
    return this.translate.currentLang;
  }

  constructor(public configService: ConfigService,
              public translate: TranslateService) { }

  ngOnInit(): void {
    this.defaultLanguage = this.configService.getDefaultLanguage();
    this.translate.onLangChange.subscribe((lang) => this.updateLang(lang));
    this.updateLang(this.translate.currentLang);
  }

  updateLang(lang: string): void {
    if (this.infoVersion.availableLanguages.includes(lang)) {
      this.infos = this.infoVersion.data[lang] as Information;
    } else {
      this.infos = this.infoVersion.data[this.defaultLanguage] as Information;
    }
  }
}
