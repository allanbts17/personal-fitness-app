import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { InstructorDashboardPage } from './dashboard.page';
import { SettingsPage } from './settings/settings.page';
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
                path: 'settings',
                component: SettingsPage
            },
            {
                path: 'students',
                loadChildren: () => import('./students/students.module').then(m => m.StudentsPageModule)
            },
            {
                path: 'student-details/:id',
                loadChildren: () => import('./student-details/student-details.module').then(m => m.StudentDetailsPageModule)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ])
    ],
    declarations: [InstructorDashboardPage, SettingsPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InstructorPageModule { }
