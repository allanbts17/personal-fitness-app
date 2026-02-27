import { Component, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    template: `
    <ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-buttons slot="start" *ngIf="showBackButton">
          <ion-back-button [defaultHref]="defaultHref"></ion-back-button>
        </ion-buttons>
        <ion-title class="ps-4">{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()">
            <ion-icon name="log-out-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  `,
    standalone: false
})
export class HeaderComponent {
    @Input() title: string = '';
    @Input() showBackButton: boolean = false;
    @Input() defaultHref: string = '';

    constructor(
        private authService: AuthService,
        private navCtrl: NavController
    ) { }

    async logout() {
        await this.authService.logout();
        this.navCtrl.navigateRoot('/login');
    }
}
