import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SubjectRecordsComponent } from './pages/subject-records/subject-records.component';
import { EntryPageComponent } from './pages/entry-page/entry-page.component';
import { TreatmentsPageComponent } from './pages/entries-page/treatments-page.component';
import { BasicinfoPageComponent } from './pages/entries-page/basicinfo-page.component';
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
        path: 'configuration',
        children: [
          {
            path: ':type/:id',
            component: EntryPageComponent
          },
          {
            path: 'basicinfo',
            component: BasicinfoPageComponent
          },
          {
            path: 'treatments',
            component: TreatmentsPageComponent
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
