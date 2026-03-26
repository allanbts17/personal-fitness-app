import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage {
  email: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {}

  async resetPassword() {
    if (!this.email) return;

    this.isLoading = true;
    try {
      await this.authService.sendResetPasswordEmail(this.email);
      await this.presentToast('Enlace de recuperación enviado. Revisa tu correo.', 'success');
      this.navCtrl.navigateBack('/login');
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      let message = 'Ocurrió un error al enviar el correo. Por favor intenta de nuevo.';
      if (error.code === 'auth/user-not-found') {
        message = 'No existe una cuenta asociada a este correo electrónico.';
      }
      await this.presentToast(message, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
