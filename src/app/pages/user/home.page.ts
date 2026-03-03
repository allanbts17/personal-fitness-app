import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FitnessService } from '../../services/fitness.service';
import { UserProfile, Routine } from '../../models/fitness.models';
import { combineLatest, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-user-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class UserHomePage implements OnInit {
  userProfile: UserProfile | null = null;
  assignedRoutines: Routine[] = [];
  isLoadingRoutines: boolean = true;

  // Data for the modal
  isFirstTimeModalOpen: boolean = false;
  inputWeight: number | null = null;
  inputWeightUnit: 'kg' | 'lb' = 'lb';
  inputHeight: number | null = null; // cm

  constructor(
    private authService: AuthService,
    private fitnessService: FitnessService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(profile => {
      if (profile) {
        this.userProfile = profile;
        if (profile.role === 'user' && (!profile.physicalData?.weight || !profile.physicalData?.height)) {
          // Si es la primera vez o no tiene datos completos Y ES UN USUARIO
          this.isFirstTimeModalOpen = true;
        } else {
          // Cargar en el form por si edita
          this.inputWeight = profile.physicalData?.weight || null;
          this.inputWeightUnit = profile.physicalData?.weightUnit || 'lb';
          this.inputHeight = profile.physicalData?.height || null;
        }

        // Fetch assigned routines
        if (profile.role === 'user') {
          if (profile.assignedRoutineIds && profile.assignedRoutineIds.length > 0) {
            this.isLoadingRoutines = true;
            const routineObservables = profile.assignedRoutineIds.map(id =>
              this.fitnessService.getRoutineById(id).pipe(
                // Filter out undefined if routine was deleted but ID remains
                map(routine => routine || null),
                catchError(() => of(null))
              )
            );

            combineLatest(routineObservables).subscribe(routines => {
              this.assignedRoutines = routines.filter(r => r !== null) as Routine[];
              this.isLoadingRoutines = false;
            });
          } else {
            this.assignedRoutines = [];
            this.isLoadingRoutines = false;
          }
        }
      } else {
        this.isLoadingRoutines = false;
      }
    });
  }

  openEditModal() {
    this.isFirstTimeModalOpen = true;
  }

  closeEditModal() {
    // Si no tiene datos en absoluto, no dejamos que lo cierre para que sea obligatorio el 1er ingreso
    if (!this.userProfile?.physicalData?.weight || !this.userProfile?.physicalData?.height) {
      this.mostrarToast('Por favor completa tus datos para continuar.', 'warning');
      return;
    }
    this.isFirstTimeModalOpen = false;
  }

  async savePhysicalData() {
    if (!this.inputWeight || !this.inputHeight || !this.userProfile) {
      this.mostrarToast('Por favor, ingresa tu peso y altura.', 'warning');
      return;
    }

    // Calcular IMC
    // Formula IMC: peso(kg) / (altura(m) * altura(m))
    let weightKg = this.inputWeightUnit === 'lb' ? this.inputWeight * 0.453592 : this.inputWeight;
    let heightM = this.inputHeight / 100;
    let computedBmi = weightKg / (heightM * heightM);

    try {
      await this.fitnessService.updatePhysicalData(this.userProfile.uid, {
        weight: this.inputWeight,
        weightUnit: this.inputWeightUnit,
        height: this.inputHeight,
        bmi: computedBmi
      });

      this.isFirstTimeModalOpen = false;
      this.mostrarToast('Datos guardados correctamente', 'success');

      // Actualizar localmente para no esperar recarga pesada
      if (!this.userProfile.physicalData) {
        this.userProfile.physicalData = { weight: 0, weightUnit: 'lb', height: 0, bmi: 0, lastUpdate: new Date() };
      }
      this.userProfile.physicalData.weight = this.inputWeight;
      this.userProfile.physicalData.weightUnit = this.inputWeightUnit;
      this.userProfile.physicalData.height = this.inputHeight;
      this.userProfile.physicalData.bmi = computedBmi;

    } catch (error) {
      console.error(error);
      this.mostrarToast('Ocurrió un error al guardar los datos', 'danger');
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

