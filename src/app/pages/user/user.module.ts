import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { UserHomePage } from './home.page';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([{ path: 'home', component: UserHomePage }])
    ],
    declarations: [UserHomePage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserPageModule { }
