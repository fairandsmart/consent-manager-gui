import { Directive, Input } from '@angular/core';
import { ModelData, ModelEntryDto, ModelVersionDto, RecordDto } from '../../../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';

@Directive()
export abstract class EntryCardContentDirective<T extends ModelData> {

  @Input()
  entry: ModelEntryDto;

  @Input()
  version: ModelVersionDto<T>;

  @Input()
  record: RecordDto;

  protected constructor(protected translate: TranslateService) { }

  getData(): T {
    return this.version.data[this.translate.currentLang];
  }

}
