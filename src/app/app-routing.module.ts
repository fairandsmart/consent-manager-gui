import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntryComponent } from './entry/entry.component';
import { RecordsComponent } from './records/records.component';
import { UserRecordsComponent } from './user-records/user-records.component';
import { RolesGuardService } from './guards/roles-guard.service';
import { ConfigComponent } from './config/config.component';
import { FormCreatorComponent } from './form-creator/form-creator.component';
import { EntriesPageComponent } from './entries-page/entries-page.component';
import { ThemesPageComponent } from './themes-page/themes-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'config/entries',
    pathMatch: 'full'
  },
  {
    path: 'config',
    component: ConfigComponent,
    canActivate: [RolesGuardService],
    data: {
      roles: ['admin']
    },
    children: [
      {
        path: 'entries',
        component: EntriesPageComponent
      },
      {
        path: 'entries/:id',
        component: EntryComponent
      },
      {
        path: 'themes',
        component: ThemesPageComponent
      },
      {
        path: 'themes/:id',
        component: EntryComponent
      },
      {
        path: 'records',
        component: RecordsComponent
      },
      {
        path: 'records/:user',
        component: UserRecordsComponent
      },
      {
        path: 'form',
        component: FormCreatorComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
