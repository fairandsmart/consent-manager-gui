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
import { UserRoutingModule } from './user-routing.module';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { CoreModule } from '../../core/core.module';
import { EntriesPageComponent } from './pages/entries-page/entries-page.component';
import { EntryCardComponent } from './components/entry/entry-card/entry-card.component';
import { ProcessingComponent } from './components/entry/processing/processing.component';
import { SharedModule } from '../../shared/shared.module';
import { PreferenceComponent } from './components/entry/preference/preference.component';
import { ConditionsComponent } from './components/entry/conditions/conditions.component';

@NgModule({
  declarations: [
    UserPageComponent,
    EntriesPageComponent,
    EntryCardComponent,
    ProcessingComponent,
    PreferenceComponent,
    ConditionsComponent
  ],
  imports: [
    UserRoutingModule,
    CoreModule,
    SharedModule
  ]
})
export class UserModule { }
