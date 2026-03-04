import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoutineExecutionPageRoutingModule } from './routine-execution-routing.module';

import { RoutineExecutionPage } from './routine-execution.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoutineExecutionPageRoutingModule
  ],
  declarations: [RoutineExecutionPage]
})
export class RoutineExecutionPageModule {}
