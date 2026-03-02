import { Component, OnInit } from '@angular/core';
import { GlobalConfigService } from './services/global-config.service';

@Component({
    selector: 'app-root',
    template: '<ion-app><ion-router-outlet></ion-router-outlet></ion-app>',
    standalone: false
})
export class AppComponent implements OnInit {
    constructor(private globalConfig: GlobalConfigService) { }

    ngOnInit() {
        this.globalConfig.loadConfig();
    }
}
