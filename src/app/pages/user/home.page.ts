import { Component } from '@angular/core';

@Component({
    selector: 'app-user-home',
    template: `
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-title>My Fitness</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h1>Welcome back!</h1>
      <p>Today's routines and progress tracking will be here.</p>
    </ion-content>
  `
})
export class UserHomePage { }
