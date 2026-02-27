import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageRoutinesPage } from './manage-routines.page';

const routes: Routes = [
  {
    path: '',
    component: ManageRoutinesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageRoutinesPageRoutingModule {}
