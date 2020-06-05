import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntriesComponent } from './entries/entries.component';
import { EntryComponent } from './entry/entry.component';
import { RecordsComponent } from './records/records.component';
import { UserRecordsComponent } from './user-records/user-records.component';
import { TokenCreationComponent } from './token-creation/token-creation.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'entries',
    pathMatch: 'full'
  },
  {
    path: 'entries',
    component: EntriesComponent
  },
  {
    path: 'entries/:id',
    component: EntryComponent
  },
  {
    path: 'records',
    component: RecordsComponent
  },
  {
    path: 'records/:user',
    component: UserRecordsComponent
  },
  {
    path: 'token',
    component: TokenCreationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
