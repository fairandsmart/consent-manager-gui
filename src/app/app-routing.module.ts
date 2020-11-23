import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesGuardService } from './core/guards/roles-guard.service';
import { EnablingGuardService } from './core/guards/enabling-guard.service';
import { environment } from '../environments/environment';
import { HomeGuardService } from './core/guards/home-guard.service';
import { RoutingErrorPageComponent } from './core/pages/routing-error-page/routing-error-page.component';

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
    canActivate: [RolesGuardService],
    data: {
      roles: ['admin']
    }
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
    canActivate: [EnablingGuardService],
    data: {
      enabled: environment.customization.displayUserPage
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
