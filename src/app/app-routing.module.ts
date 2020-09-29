import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntryComponent } from './entry/entry.component';
import { RolesGuardService } from './guards/roles-guard.service';
import { ConfigComponent } from './config/config.component';
import { FormCreatorComponent } from './form-creator/form-creator.component';
import { ThemesPageComponent } from './themes-page/themes-page.component';
import { ConditionsPageComponent } from './conditions-page/conditions-page.component';
import { ConditionsReadOnlyComponent } from './conditions-read-only/conditions-read-only.component';
import { EmailsPageComponent } from './emails-page/emails-page.component';
import { PreferencesPageComponent } from './preferences-page/preferences-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SubjectRecordsComponent } from './subject-records/subject-records.component';
import { FootersPageComponent } from './footers-page/footers-page.component';
import { TreatmentsPageComponent } from './treatments-page/treatments-page.component';
import { HeadersPageComponent } from './headers-page/headers-page.component';
import { KeysComponent } from './keys/keys.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin/home',
    pathMatch: 'full'
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
            path: 'headers',
            component: HeadersPageComponent
          },
          {
            path: 'headers/:id',
            component: EntryComponent
          },
          {
            path: 'treatments',
            component: TreatmentsPageComponent
          },
          {
            path: 'treatments/:id',
            component: EntryComponent
          },
          {
            path: 'footers',
            component: FootersPageComponent
          },
          {
            path: 'footers/:id',
            component: EntryComponent
          },
          {
            path: 'preferences',
            component: PreferencesPageComponent
          },
          {
            path: 'preferences/:id',
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
        path: 'home',
        component: DashboardComponent
      },
      {
        path: 'home/:subject',
        component: SubjectRecordsComponent
      },
      {
        path: 'integration',
        component: FormCreatorComponent
      },
      {
        path: 'api',
        component: KeysComponent
      }
    ]
  },
  {
    path: 'conditions/:owner/:key',
    component: ConditionsReadOnlyComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
