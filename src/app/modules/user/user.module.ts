import { NgModule } from '@angular/core';
import { UserRoutingModule } from './user-routing.module';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { CoreModule } from '../../core/core.module';
import { EntriesPageComponent } from './pages/entries-page/entries-page.component';
import { EntryCardComponent } from './components/entry/entry-card/entry-card.component';
import { TreatmentComponent } from './components/entry/treatment/treatment.component';
import { SharedModule } from '../../shared/shared.module';
import { PreferenceComponent } from './components/entry/preference/preference.component';
import { ConditionsComponent } from './components/entry/conditions/conditions.component';

@NgModule({
  declarations: [
    UserPageComponent,
    EntriesPageComponent,
    EntryCardComponent,
    TreatmentComponent,
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
