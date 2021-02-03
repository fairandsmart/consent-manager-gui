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
