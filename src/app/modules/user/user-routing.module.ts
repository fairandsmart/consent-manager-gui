import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { EntriesPageComponent } from './pages/entries-page/entries-page.component';
import { UserGuardService } from '../../core/guards/user-guard.service';

const routes: Routes = [
  {
    path: '',
    component: UserPageComponent,
    children: [
      {
        path: ':subject/me',
        component: EntriesPageComponent,
        canActivate: [UserGuardService]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
