import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { ComponentsModule } from '../../../components/components.module';

import { FitnessService } from '../../../services/fitness.service';
import { Exercise, Routine } from '../../../models/fitness.models';
import { AuthService } from '../../../services/auth.service';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manage-routines',
  templateUrl: './manage-routines.page.html',
  styleUrls: ['./manage-routines.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ComponentsModule, RouterModule]
})
export class ManageRoutinesPage implements OnInit {

  // Almacena el resultado final ya agrupado
  parsedRoutines: Routine[] = [];
  parsedNewExercises: Exercise[] = [];

  existingRoutines: Routine[] = [];
  existingExercises: Exercise[] = [];

  instructorId: string = '';

  constructor(
    private fitnessService: FitnessService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.instructorId = user.uid;
        this.loadData();
      }
    });
  }

  async confirmarBorrado(routine: Routine, event: Event) {
    event.stopPropagation();

    if (!routine.id) return;

    const alert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro que deseas eliminar la rutina "${routine.name}"? Esta acción no se puede deshacer.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: async () => {
            const loading = await this.loadingCtrl.create({ message: 'Eliminando...' });
            await loading.present();
            try {
              await this.fitnessService.deleteRoutine(routine.id!);
              loading.dismiss();
              this.mostrarToast('Rutina eliminada correctamente', 'success');
              // The routines list should update automatically if it's connected to Firestore real-time.
            } catch (error) {
              loading.dismiss();
              console.error('Error deleting routine:', error);
              this.mostrarToast('Error al eliminar la rutina', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  loadData() {
    this.fitnessService.getExercises().subscribe(ex => {
      this.existingExercises = ex;
    });

    this.fitnessService.getRoutinesByInstructor(this.instructorId).subscribe(routines => {
      this.existingRoutines = routines;
    });
  }

  // Se lanza cuando el usuario selecciona un archivo
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      this.processData(data);
    };

    reader.readAsBinaryString(file);
    event.target.value = '';
  }

  processData(data: any[]) {
    const routinesMap = new Map<string, Routine>();
    this.parsedNewExercises = []; // Reset new exercises
    this.parsedRoutines = []; // Reset routines

    data.forEach(row => {
      const routineName = row['Rutina'];
      if (!routineName) return;

      if (!routinesMap.has(routineName)) {
        routinesMap.set(routineName, {
          name: routineName,
          createdBy: this.instructorId,
          exercises: []
        });
      }

      const routine = routinesMap.get(routineName)!;

      const rawExerciseName = row['Ejercicio'] || 'ejercicio';

      // Validar si existe el ejercicio
      let exerciseId = this.findExistingExerciseId(rawExerciseName);

      if (!exerciseId) {
        // Generamos un nuevo ID y lo preparamos para guardarlo si no existe
        exerciseId = this.generateId(rawExerciseName);

        // Evitar triplicados en memoria en la misma subida de Excel
        if (!this.parsedNewExercises.find(ex => ex.id === exerciseId)) {
          this.parsedNewExercises.push({
            id: exerciseId,
            name: rawExerciseName,
            description: 'Importado de Excel',
          });
        }
      }

      const session = {
        order: row['Orden'] || 1,
        exerciseId: exerciseId,
        exerciseName: rawExerciseName,
        durationValue: row['Duracion_Segundos'] || 0,
        reps: row['Max_Rep'] || 0,
        restSeconds: row['Descanso_Segundos'] || 0
      };

      routine.exercises.push(session);
    });

    this.parsedRoutines = Array.from(routinesMap.values());
  }

  findExistingExerciseId(name: string): string | null {
    const normalizedName = this.normalizeString(name);
    const found = this.existingExercises.find(ex => this.normalizeString(ex.name) === normalizedName);
    if (found && found.id) {
      return found.id;
    } // Note: Sometimes documents don't have id property if it's the document key, but usually idField takes care of it.

    // Si ya lo ingresamos en el Excel dentro de las pasadas recientes, devolver ese mismo ID
    const foundInNew = this.parsedNewExercises.find(ex => this.normalizeString(ex.name) === normalizedName);
    if (foundInNew && foundInNew.id) {
      return foundInNew.id;
    }

    return null;
  }

  normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");
  }

  generateId(name: string): string {
    const cleanName = this.normalizeString(name);
    const randomDigits = Math.floor(10 + Math.random() * 90);
    return `${cleanName}${randomDigits}`;
  }

  async confirmarSubida() {
    const loading = await this.loadingCtrl.create({
      message: 'Guardando rutinas y ejercicios...'
    });
    await loading.present();

    try {
      // Guardar ejercicios nuevos
      for (const ex of this.parsedNewExercises) {
        await this.fitnessService.addExercise(ex);
      }

      // Guardar las rutinas
      for (const routine of this.parsedRoutines) {
        await this.fitnessService.addRoutine(routine);
      }

      loading.dismiss();
      this.mostrarToast('Datos guardados correctamente', 'success');
      this.clearData();

    } catch (error) {
      loading.dismiss();
      console.error('Error al guardar datos', error);
      this.mostrarToast('Error al guardar datos. Revisa la consola.', 'danger');
    }
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      color: color
    });
    toast.present();
  }

  clearData() {
    this.parsedRoutines = [];
    this.parsedNewExercises = [];
  }

  formatGroups(groups: number[]): string {
    return groups.map(g => `Grupo ${g}`).join(', ');
  }
}
