import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { ImcCardComponent } from './imc-card/imc-card.component';

@NgModule({
    declarations: [HeaderComponent, ImcCardComponent],
    imports: [
        CommonModule,
        IonicModule
    ],
    providers: [DecimalPipe],
    exports: [HeaderComponent, ImcCardComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
