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
import { RolesGuardService } from './core/guards/roles-guard.service';
import { HomeGuardService } from './core/guards/home-guard.service';
import { RoutingErrorPageComponent } from './core/pages/routing-error-page/routing-error-page.component';
import { ConfigService } from './core/services/config.service';

const routes: Routes = [
  {
    path: '',
    component: RoutingErrorPageComponent,
    pathMatch: 'full',
    canActivate: [HomeGuardService]
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canLoad: [ConfigService],
    canActivate: [RolesGuardService],
    data: {
      roles: ['admin']
    }
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
    canLoad: [ConfigService],
    data: {
      config: {
        userPageEnabled: true
      }
    }
  },
  {
    path: '**',
    component: RoutingErrorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
