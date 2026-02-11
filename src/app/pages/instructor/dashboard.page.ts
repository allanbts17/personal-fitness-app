import { Component } from '@angular/core';

@Component({
  selector: 'app-instructor-dashboard',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-title>Instructor Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding bg-gray-50">
      <div class="max-w-4xl mx-auto mt-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">Welcome, Instructor</h1>
        <p class="text-gray-600">Manage clients, exercises, and routines here.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div class="flex items-center space-x-4">
              <div class="bg-blue-100 p-3 rounded-full text-material-blue">
                <ion-icon name="people" class="text-2xl"></ion-icon>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800">My Clients</h3>
                <p class="text-sm text-gray-500">View and manage client progress</p>
              </div>
            </div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div class="flex items-center space-x-4">
              <div class="bg-green-100 p-3 rounded-full text-green-600">
                <ion-icon name="barbell" class="text-2xl"></ion-icon>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800">Exercises</h3>
                <p class="text-sm text-gray-500">Create and edit exercise library</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  standalone: false
})
export class InstructorDashboardPage { }
