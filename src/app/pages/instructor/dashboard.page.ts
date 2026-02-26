import { Component } from '@angular/core';

@Component({
  selector: 'app-instructor-dashboard',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-title>Panel del Instructor</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding bg-gray-50">
      <div class="max-w-4xl mx-auto mt-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">Bienvenido, Instructor</h1>
        <p class="text-gray-600">Gestiona clientes, ejercicios y rutinas aquí.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div class="flex items-center space-x-4">
              <div class="bg-blue-100 p-3 rounded-full text-material-blue">
                <ion-icon name="people" class="text-2xl"></ion-icon>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800">Mis Clientes</h3>
                <p class="text-sm text-gray-500">Ver y gestionar el progreso de los clientes</p>
              </div>
            </div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div class="flex items-center space-x-4">
              <div class="bg-green-100 p-3 rounded-full text-green-600">
                <ion-icon name="barbell" class="text-2xl"></ion-icon>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800">Ejercicios</h3>
                <p class="text-sm text-gray-500">Crear y editar la biblioteca de ejercicios</p>
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
