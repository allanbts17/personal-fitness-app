import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserHomePage } from './home.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComponentsModule,
        RouterModule.forChild([{ path: 'home', component: UserHomePage }])
    ],
    declarations: [UserHomePage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserPageModule { }
