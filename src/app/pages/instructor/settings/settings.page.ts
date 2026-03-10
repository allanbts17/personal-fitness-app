import { Component, OnInit } from '@angular/core';
import { FitnessService } from '../../../services/fitness.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  standalone: false
})
export class SettingsPage implements OnInit {
  welcomeMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private fitnessService: FitnessService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    this.loadSettings();
  }

  async loadSettings() {
    this.fitnessService.getGeneralConfig().subscribe({
      next: (config: any) => {
        if (config) {
          this.welcomeMessage = config.welcomeMessage || '';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading config', err);
        this.isLoading = false;
      }
    });
  }

  async saveSettings() {
    const loading = await this.loadingCtrl.create({
      message: 'Guardando configuración...'
    });
    await loading.present();

    try {
      await this.fitnessService.updateGeneralConfig({
        welcomeMessage: this.welcomeMessage
      });
      
      const toast = await this.toastCtrl.create({
        message: 'Configuración guardada exitosamente',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
    } catch (error) {
      console.error('Error saving settings', error);
      const toast = await this.toastCtrl.create({
        message: 'Error al guardar la configuración',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }
}
