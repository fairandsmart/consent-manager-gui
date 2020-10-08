import { NgModule } from '@angular/core';
import { TextOverflowDirective } from './directives/text-overflow.directive';
import { ShortenIdPipe } from './pipes/shorten-id.pipe';

@NgModule({
  declarations: [
    TextOverflowDirective,
    ShortenIdPipe,
  ],
  exports: [
    TextOverflowDirective,
    ShortenIdPipe
  ]
})
export class SharedModule { }
