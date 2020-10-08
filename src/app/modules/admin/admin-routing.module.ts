import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { RolesGuardService } from '../../core/guards/roles-guard.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SubjectRecordsComponent } from './pages/subject-records/subject-records.component';
import { EntryPageComponent } from './pages/entry-page/entry-page.component';
import { HeadersPageComponent } from './pages/entries-page/headers-page.component';
import { TreatmentsPageComponent } from './pages/entries-page/treatments-page.component';
import { FootersPageComponent } from './pages/entries-page/footers-page.component';
import { PreferencesPageComponent } from './pages/entries-page/preferences-page.component';
import { ConditionsPageComponent } from './pages/entries-page/conditions-page.component';
import { EmailsPageComponent } from './pages/entries-page/emails-page.component';
import { ThemesPageComponent } from './pages/entries-page/themes-page.component';
import { FormCreatorComponent } from './pages/form-creator/form-creator.component';
import { KeysComponent } from './pages/keys/keys.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    children: [
      {
        path: 'home',
        component: DashboardComponent
      },
      {
        path: 'subjects/:subject',
        component: SubjectRecordsComponent
      },
      {
        path: 'config',
        children: [
          {
            path: ':type/:id',
            component: EntryPageComponent
          },
          {
            path: 'headers',
            component: HeadersPageComponent
          },
          {
            path: 'treatments',
            component: TreatmentsPageComponent
          },
          {
            path: 'footers',
            component: FootersPageComponent
          },
          {
            path: 'preferences',
            component: PreferencesPageComponent
          },
          {
            path: 'conditions',
            component: ConditionsPageComponent
          },
          {
            path: 'emails',
            component: EmailsPageComponent
          },
          {
            path: 'themes',
            component: ThemesPageComponent
          },
        ]
      },
      {
        path: 'integration',
        children: [
          {
            path: 'form-creator',
            component: FormCreatorComponent
          },
          {
            path: 'api',
            component: KeysComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
