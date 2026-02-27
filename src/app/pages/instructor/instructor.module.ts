import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { InstructorDashboardPage } from './dashboard.page';
import { RegisterClientsPage } from './register-clients/register-clients.page';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComponentsModule,
        RouterModule.forChild([
            {
                path: 'dashboard',
                component: InstructorDashboardPage
            },
            {
                path: 'manage-routines',
                loadChildren: () => import('./manage-routines/manage-routines.module').then(m => m.ManageRoutinesPageModule)
            },
            {
                path: 'register-clients',
                component: RegisterClientsPage
            },
            {
                path: 'clients',
                loadChildren: () => import('./clients/clients.module').then(m => m.ClientsPageModule)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ])
    ],
    declarations: [InstructorDashboardPage, RegisterClientsPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InstructorPageModule { }
