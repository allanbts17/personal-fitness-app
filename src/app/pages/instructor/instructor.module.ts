import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { InstructorDashboardPage } from './dashboard.page';
import { RegisterStudentsPage } from './register-students/register-students.page';
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
                path: 'register-students',
                component: RegisterStudentsPage
            },
            {
                path: 'students',
                loadChildren: () => import('./students/students.module').then(m => m.StudentsPageModule)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ])
    ],
    declarations: [InstructorDashboardPage, RegisterStudentsPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InstructorPageModule { }
