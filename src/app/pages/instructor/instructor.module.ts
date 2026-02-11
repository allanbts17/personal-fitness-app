import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { InstructorDashboardPage } from './dashboard.page';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([{ path: 'dashboard', component: InstructorDashboardPage }])
    ],
    declarations: [InstructorDashboardPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InstructorPageModule { }
