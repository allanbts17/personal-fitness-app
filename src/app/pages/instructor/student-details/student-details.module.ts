import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudentDetailsPageRoutingModule } from './student-details-routing.module';
import { StudentDetailsPage } from './student-details.page';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentDetailsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [StudentDetailsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StudentDetailsPageModule { }
