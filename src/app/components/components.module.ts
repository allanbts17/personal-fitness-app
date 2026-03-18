import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ImcCardComponent } from './imc-card/imc-card.component';
import { ActionCardComponent } from './action-card/action-card.component';

@NgModule({
    declarations: [HeaderComponent, ImcCardComponent, ActionCardComponent],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule
    ],
    providers: [DecimalPipe],
    exports: [HeaderComponent, ImcCardComponent, ActionCardComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
