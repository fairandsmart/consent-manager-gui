import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntriesComponent } from './entries/entries.component';
import { EntryComponent } from './entry/entry.component';


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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
