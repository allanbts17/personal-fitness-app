import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { ComponentsModule } from '../../../../components/components.module';

import { FitnessService } from '../../../../services/fitness.service';
import { Exercise } from '../../../../models/fitness.models';

@Component({
  selector: 'app-edit-exercise',
  templateUrl: './edit-exercise.page.html',
  styleUrls: ['./edit-exercise.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ComponentsModule]
})
export class EditExercisePage implements OnInit {

  exercises: Exercise[] = [];
  filteredExercises: Exercise[] = [];
  searchTerm: string = '';

  selectedExercise: Exercise | null = null;

  // Variables de edición
  editName: string = '';
  editDescription: string = '';
  editImageUrl: string = '';
  isUploading: boolean = false;

  constructor(
    private fitnessService: FitnessService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.loadExercises();
  }

  loadExercises() {
    this.fitnessService.getExercises().subscribe(exs => {
      this.exercises = exs;
      this.filteredExercises = [...this.exercises];
    });
  }

  filterExercises(event: any) {
    const term = event.target.value.toLowerCase();
    this.searchTerm = term;

    if (!term) {
      this.filteredExercises = [...this.exercises];
      return;
    }

    this.filteredExercises = this.exercises.filter(ex =>
      ex.name.toLowerCase().includes(term) ||
      (ex.description && ex.description.toLowerCase().includes(term))
    );
  }

  selectExercise(exercise: Exercise) {
    this.selectedExercise = exercise;
    this.editName = exercise.name;
    this.editDescription = exercise.description || '';
    this.editImageUrl = exercise.imageUrl || '';
  }

  cancelEdit() {
    this.selectedExercise = null;
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file || !this.selectedExercise?.id) return;

    this.isUploading = true;
    try {
      const downloadUrl = await this.fitnessService.uploadExerciseImage(file, this.selectedExercise.id);
      this.editImageUrl = downloadUrl;
      this.mostrarToast('Imagen subida correctamente', 'success');
    } catch (error) {
      console.error('Error al subir imagen:', error);
      this.mostrarToast('Error al subir la imagen', 'danger');
    } finally {
      this.isUploading = false;
    }
  }

  async saveChanges() {
    if (!this.selectedExercise || !this.selectedExercise.id) return;

    if (!this.editName.trim()) {
      this.mostrarToast('El nombre del ejercicio no puede estar vacío', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Guardando cambios...'
    });
    await loading.present();

    try {
      await this.fitnessService.updateExercise(this.selectedExercise.id, {
        name: this.editName.trim(),
        description: this.editDescription.trim(),
        imageUrl: this.editImageUrl.trim()
      });

      loading.dismiss();
      this.mostrarToast('Ejercicio actualizado correctamente', 'success');
      this.selectedExercise = null; // Volver a la lista

    } catch (error) {
      loading.dismiss();
      console.error(error);
      this.mostrarToast('Error al actualizar el ejercicio', 'danger');
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

