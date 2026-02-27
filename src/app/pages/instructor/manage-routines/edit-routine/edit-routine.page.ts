import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentsModule } from '../../../../components/components.module';

import { FitnessService } from '../../../../services/fitness.service';
import { Routine } from '../../../../models/fitness.models';
import { ItemReorderEventDetail } from '@ionic/angular';

@Component({
  selector: 'app-edit-routine',
  templateUrl: './edit-routine.page.html',
  styleUrls: ['./edit-routine.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ComponentsModule]
})
export class EditRoutinePage implements OnInit {

  routineId: string = '';
  routine: Routine | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fitnessService: FitnessService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.routineId = this.route.snapshot.paramMap.get('id') || '';
    if (this.routineId) {
      this.loadRoutine();
    } else {
      this.router.navigate(['/instructor/manage-routines']);
    }
  }

  loadRoutine() {
    this.fitnessService.getRoutineById(this.routineId).subscribe(data => {
      if (data) {
        this.routine = data;
        // Ordenar ejercicios por el campo 'order'
        if (this.routine.exercises) {
          this.routine.exercises.sort((a, b) => (a.order || 0) - (b.order || 0));
        }
      } else {
        this.mostrarToast('Rutina no encontrada', 'danger');
        this.router.navigate(['/instructor/manage-routines']);
      }
    });
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    if (!this.routine || !this.routine.exercises) {
      ev.detail.complete();
      return;
    }

    // Mover el item en el arreglo
    const itemToMove = this.routine.exercises.splice(ev.detail.from, 1)[0];
    this.routine.exercises.splice(ev.detail.to, 0, itemToMove);

    // Actualizar el atributo 'order' de todos los items
    this.routine.exercises.forEach((ex, index) => {
      ex.order = index + 1;
    });

    ev.detail.complete();
  }

  removeExercise(index: number) {
    if (this.routine && this.routine.exercises) {
      this.routine.exercises.splice(index, 1);
      // Reordenar
      this.routine.exercises.forEach((ex, idx) => {
        ex.order = idx + 1;
      });
    }
  }

  async saveChanges() {
    if (!this.routine) return;

    if (!this.routine.name.trim()) {
      this.mostrarToast('El nombre de la rutina no puede estar vacío', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Guardando rutina...'
    });
    await loading.present();

    try {
      await this.fitnessService.updateRoutine(this.routineId, {
        name: this.routine.name.trim(),
        exercises: this.routine.exercises
      });

      loading.dismiss();
      this.mostrarToast('Rutina actualizada correctamente', 'success');
      this.router.navigate(['/instructor/manage-routines']);

    } catch (error) {
      loading.dismiss();
      console.error(error);
      this.mostrarToast('Error al actualizar la rutina', 'danger');
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
}

