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
import { ConditionsPageComponent } from './conditions-page/conditions-page.component';
import { ConditionsReadOnlyComponent } from './conditions-read-only/conditions-read-only.component';
import { EmailsPageComponent } from './emails-page/emails-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin/customers',
    pathMatch: 'full'
  },
  {
    path: 'conditions',
    children: [
      {
        path: '',
        redirectTo: '/admin/customers',
        pathMatch: 'full'
      },
      {
        path: ':owner',
        children: [
          {
            path: '',
            redirectTo: '/admin/customers',
            pathMatch: 'full'
          },
          {
            path: ':key',
            component: ConditionsReadOnlyComponent
          }
        ]
      }
    ]
  },
  {
    path: 'admin',
    component: ConfigComponent,
    canActivate: [RolesGuardService],
    data: {
      roles: ['admin']
    },
    children: [
      {
        path: 'config',
        children: [
          {
            path: '',
            redirectTo: '/admin/customers',
            pathMatch: 'full',
          },
          {
            path: 'elements',
            component: EntriesPageComponent
          },
          {
            path: 'elements/:id',
            component: EntryComponent
          },
          {
            path: 'conditions',
            component: ConditionsPageComponent
          },
          {
            path: 'conditions/:id',
            component: EntryComponent
          },
          {
            path: 'emails',
            component: EmailsPageComponent
          },
          {
            path: 'emails/:id',
            component: EntryComponent
          },
          {
            path: 'themes',
            component: ThemesPageComponent
          },
          {
            path: 'themes/:id',
            component: EntryComponent
          }
        ]
      },
      {
        path: 'customers',
        component: RecordsComponent
      },
      {
        path: 'customers/:user',
        component: UserRecordsComponent
      },
      {
        path: 'forms',
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
