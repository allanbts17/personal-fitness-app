import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageRoutinesPageRoutingModule } from './manage-routines-routing.module';
import { ComponentsModule } from '../../../components/components.module';

import { ManageRoutinesPage } from './manage-routines.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageRoutinesPageRoutingModule,
    ComponentsModule,
    ManageRoutinesPage
  ],
  declarations: []
})
export class ManageRoutinesPageModule { }
