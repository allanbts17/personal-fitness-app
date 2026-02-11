import { Component } from '@angular/core';

@Component({
  selector: 'app-user-home',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-title>My Fitness</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding bg-gray-50">
      <div class="max-w-4xl mx-auto mt-8">
        <div class="bg-material-blue text-white p-6 rounded-2xl shadow-lg mb-8">
          <h1 class="text-3xl font-bold mb-2">Welcome back!</h1>
          <p class="opacity-90">Ready for your workout today?</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Today's Routine</h3>
          <div class="flex items-center text-gray-400 py-8 justify-center border-2 border-dashed border-gray-100 rounded-lg">
            <p>No routines assigned for today</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Workouts</p>
            <p class="text-2xl font-bold text-material-blue">0</p>
          </div>
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Streaks</p>
            <p class="text-2xl font-bold text-orange-500">0 days</p>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  standalone: false
})
export class UserHomePage { }
