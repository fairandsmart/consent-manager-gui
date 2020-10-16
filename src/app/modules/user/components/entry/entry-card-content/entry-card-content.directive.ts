import { Directive, Input } from '@angular/core';
import { ModelData, ModelEntryDto, ModelVersionDto } from '../../../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';

@Directive()
export abstract class EntryCardContentDirective<T extends ModelData> {

  @Input()
  entry: ModelEntryDto;

  @Input()
  version: ModelVersionDto<T>;

  protected constructor(
    protected translate: TranslateService) { }

}
