import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../../components/components.module';

@Component({
  selector: 'app-manage-routines',
  templateUrl: './manage-routines.page.html',
  styleUrls: ['./manage-routines.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ComponentsModule]
})
export class ManageRoutinesPage implements OnInit {

  // Almacena el resultado final ya agrupado y con IDs
  parsedRoutines: any[] = [];

  constructor() { }

  ngOnInit() {
  }

  // Se lanza cuando el usuario selecciona un archivo
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      // 1. Leer archivo
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      // 2. Obtener primera hoja
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // 3. Convertir a JSON
      const data = XLSX.utils.sheet_to_json(ws);

      // 4. Procesar y agrupar rutinas
      this.processData(data);
    };

    reader.readAsBinaryString(file);

    // Reseteamos el input para permitir subir el mismo archivo de nuevo
    event.target.value = '';
  }

  // Ojo: El nombre de la columna en Excel debe coincidir exacto.
  // En tu Excel de prueba son: Rutina, Orden, Ejercicio, Duracion_Segundos, Series, Descanso_Segundos
  processData(data: any[]) {
    const routinesMap = new Map<string, any>();

    data.forEach(row => {
      const routineName = row['Rutina'];
      if (!routineName) return; // Ignora filas en blanco o sin nombre

      // Si no existe la rutina en el mapa, la creamos
      if (!routinesMap.has(routineName)) {
        routinesMap.set(routineName, {
          id: this.generateId(routineName),
          routineName: routineName,
          totalDurationSeconds: 0, // Lo podrías calcular si quisieras
          sessions: []
        });
      }

      // Obtenemos la rutina y le agregamos la sesión de ejercicio
      const routine = routinesMap.get(routineName);

      const session = {
        order: row['Orden'] || 1,
        exerciseId: this.generateId(row['Ejercicio'] || 'ejercicio'), // Aquí crearíamos o enlazaríamos el ID
        exerciseName: row['Ejercicio'],
        durationValue: row['Duracion_Segundos'] || row['Repeticiones'] || 0,
        sets: row['Series'] || 3,
        restSeconds: row['Descanso_Segundos'] || 0
      };

      routine.sessions.push(session);
    });

    // Convertimos el Map a Array para mostrarlo en el HTML
    this.parsedRoutines = Array.from(routinesMap.values());
    console.log('Rutinas procesadas: ', this.parsedRoutines);
  }

  // Genera un ID tomando el nombre, minúsculas, sin espacios/tildes, y 2 dígitos
  generateId(name: string): string {
    const cleanName = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Quitar tildes
      .replace(/\s+/g, ""); // Quitar espacios

    const randomDigits = Math.floor(10 + Math.random() * 90); // 10 a 99
    return `${cleanName}${randomDigits}`;
  }

  clearData() {
    this.parsedRoutines = [];
  }
}
