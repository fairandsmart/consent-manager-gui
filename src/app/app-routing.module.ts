import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConditionsReadOnlyComponent } from './conditions-read-only/conditions-read-only.component';
import { RolesGuardService } from './core/guards/roles-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin/home',
    pathMatch: 'full'
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
