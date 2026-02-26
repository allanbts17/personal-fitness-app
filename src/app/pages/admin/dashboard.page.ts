import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-title>Panel de Administración</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding bg-gray-50">
      <div class="max-w-4xl mx-auto mt-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">Bienvenido, Administrador</h1>
        <p class="text-gray-600">El monitoreo del sistema y la gestión de usuarios estarán aquí.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 class="text-lg font-semibold text-material-blue">Usuarios</h3>
            <p class="text-3xl font-bold mt-2">150</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 class="text-lg font-semibold text-material-blue">Entrenadores</h3>
            <p class="text-3xl font-bold mt-2">12</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 class="text-lg font-semibold text-material-blue">Clientes</h3>
            <p class="text-3xl font-bold mt-2">45</p>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  standalone: false
})
export class AdminDashboardPage { }
