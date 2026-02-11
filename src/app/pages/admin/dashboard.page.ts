import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <ion-header>
      <ion-toolbar color="danger">
        <ion-title>Admin Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h1>Welcome, Admin</h1>
      <p>System monitoring and user management will be here.</p>
    </ion-content>
  `,
  standalone: false
})
export class AdminDashboardPage { }
