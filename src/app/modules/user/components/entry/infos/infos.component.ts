import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Information, ModelVersionDto } from '@fairandsmart/consents-ce/models';
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

  constructor(public configService: ConfigService,
              public translate: TranslateService,
              protected ref: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.defaultLanguage = this.configService.getDefaultLanguage();
  }

  getData(): Information {
    if (this.infoVersion.availableLanguages.includes(this.translate.currentLang)) {
      return this.infoVersion.data[this.translate.currentLang] as Information;
    } else {
      return this.infoVersion.data[this.defaultLanguage] as Information;
    }
  }
}
