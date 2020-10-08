import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../core/core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CoreModule,
    NoopAnimationsModule,
    TranslateModule.forRoot()
  ],
  exports: [
    CoreModule
  ]
})
export class CoreTestingModule { }
