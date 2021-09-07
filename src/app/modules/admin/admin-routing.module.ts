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
import { RouterModule, Routes } from '@angular/router';
import { AdminPageContainerComponent } from './pages/admin-page-container/admin-page-container.component';
import { DashboardPageComponent } from './pages/Home/dashboard-page/dashboard-page.component';
import { ModelEntryPageComponent } from './pages/Configuration/model-entry-page/model-entry-page.component';
import { ProcessingPageComponent } from './pages/Configuration/model-library-pages/processing-page.component';
import { InformationPageComponent } from './pages/Configuration/model-library-pages/information-page.component';
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
            path: 'information',
            component: InformationPageComponent
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
