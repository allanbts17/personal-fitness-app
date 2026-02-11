import { Component } from '@angular/core';

@Component({
  selector: 'app-instructor-dashboard',
  template: `
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-title>Instructor Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h1>Welcome, Instructor</h1>
      <p>Manage clients, exercises, and routines here.</p>
    </ion-content>
  `,
  standalone: false
})
export class InstructorDashboardPage { }
