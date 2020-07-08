import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntriesComponent } from './entries/entries.component';
import { EntryComponent } from './entry/entry.component';
import { RecordsComponent } from './records/records.component';
import { UserRecordsComponent } from './user-records/user-records.component';
import { RolesGuardService } from './guards/roles-guard.service';
import { ConfigComponent } from './config/config.component';
import { ThemesComponent } from './themes/themes.component';
import { FormCreatorComponent } from './form-creator/form-creator.component';

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
        component: EntriesComponent
      },
      {
        path: 'entries/:id',
        component: EntryComponent
      },
      {
        path: 'themes',
        component: ThemesComponent
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
