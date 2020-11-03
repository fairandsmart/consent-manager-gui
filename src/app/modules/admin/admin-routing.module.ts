import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EntryPageComponent } from './pages/entry-page/entry-page.component';
import { ProcessingPageComponent } from './pages/entries-page/processing-page.component';
import { BasicinfoPageComponent } from './pages/entries-page/basicinfo-page.component';
import { PreferencesPageComponent } from './pages/entries-page/preferences-page.component';
import { ConditionsPageComponent } from './pages/entries-page/conditions-page.component';
import { EmailsPageComponent } from './pages/entries-page/emails-page.component';
import { ThemesPageComponent } from './pages/entries-page/themes-page.component';
import { FormCreatorComponent } from './pages/form-creator/form-creator.component';
import { KeysComponent } from './pages/keys/keys.component';
import { OperatorSubjectPageComponent } from './pages/operator-subject-page/operator-subject-page.component';

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
        component: OperatorSubjectPageComponent
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
            path: 'processing',
            component: ProcessingPageComponent
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
