import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutineExecutionPage } from './routine-execution.page';

const routes: Routes = [
  {
    path: '',
    component: RoutineExecutionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutineExecutionPageRoutingModule {}
