import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterStudentsPage } from './register-students.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterStudentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterStudentsPageRoutingModule {}
