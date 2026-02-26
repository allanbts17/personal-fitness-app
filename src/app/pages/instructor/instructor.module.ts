import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { InstructorDashboardPage } from './dashboard.page';
import { RegisterClientsPage } from './register-clients/register-clients.page';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        RouterModule.forChild([
            { path: 'dashboard', component: InstructorDashboardPage },
            { path: 'register-clients', component: RegisterClientsPage }
        ])
    ],
    declarations: [InstructorDashboardPage, RegisterClientsPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InstructorPageModule { }
