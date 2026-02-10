import { NgModule } from '@angular/core';
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
    declarations: [UserHomePage]
})
export class UserPageModule { }
