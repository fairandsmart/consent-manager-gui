import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageContainerComponent } from './pages/admin-page-container/admin-page-container.component';
import { DashboardPageComponent } from './pages/Home/dashboard-page/dashboard-page.component';
import { ModelEntryPageComponent } from './pages/Configuration/model-entry-page/model-entry-page.component';
import { ProcessingPageComponent } from './pages/Configuration/model-library-pages/processing-page.component';
import { BasicinfoPageComponent } from './pages/Configuration/model-library-pages/basicinfo-page.component';
import { PreferencesPageComponent } from './pages/Configuration/model-library-pages/preferences-page.component';
import { ConditionsPageComponent } from './pages/Configuration/model-library-pages/conditions-page.component';
import { EmailsPageComponent } from './pages/Configuration/model-library-pages/emails-page.component';
import { ThemesPageComponent } from './pages/Configuration/model-library-pages/themes-page.component';
import { CollectFormCreatorPageComponent } from './pages/Integration/collect-form-creator-page/collect-form-creator-page.component';
import { AccessKeysPageComponent } from './pages/Integration/access-keys-page/access-keys-page.component';
import { OperatorSubjectPageComponent } from './pages/Subject/operator-subject-page/operator-subject-page.component';
import { GettingStartedPageComponent } from './pages/getting-started-page/getting-started-page.component';
import { InterrogatePageComponent } from './pages/Integration/interrogate-page/interrogate-page.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPageContainerComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: DashboardPageComponent
      },
      {
        path: 'subjects/:subject',
        component: OperatorSubjectPageComponent
      },
      {
        path: 'configuration',
        children: [
          {
            path: 'getting-started',
            component: GettingStartedPageComponent
          },
          {
            path: ':type/:id',
            component: ModelEntryPageComponent
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
            path: 'getting-started',
            component: GettingStartedPageComponent
          },
          {
            path: 'collect',
            component: CollectFormCreatorPageComponent
          },
          {
            path: 'search',
            component: InterrogatePageComponent
          },
          {
            path: 'security',
            component: AccessKeysPageComponent
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
