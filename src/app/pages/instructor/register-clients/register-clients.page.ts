import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { LoadingController, ToastController, NavController } from '@ionic/angular';

@Component({
    selector: 'app-register-clients',
    templateUrl: './register-clients.page.html',
    standalone: false
})
export class RegisterClientsPage {
    tempPassword: string = '';
    emails: string[] = ['', '', '', ''];
    instructorId: string = '';

    constructor(
        private authService: AuthService,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private navCtrl: NavController
    ) {
        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.instructorId = user.uid;
            }
        });
    }

    addEmailField() {
        this.emails.push('');
    }

    removeEmailField(index: number) {
        if (this.emails.length > 1) {
            this.emails.splice(index, 1);
        } else {
            this.emails[0] = '';
        }
    }

    async registerClients() {
        const validEmails = this.emails.filter(e => e.trim() !== '');

        if (validEmails.length === 0) {
            this.showToast('Por favor, ingresa al menos un correo.', 'warning');
            return;
        }

        if (!this.tempPassword || this.tempPassword.length < 6) {
            this.showToast('La contraseña temporal debe tener al menos 6 caracteres.', 'warning');
            return;
        }

        const loading = await this.loadingCtrl.create({
            message: 'Registrando clientes...',
        });
        await loading.present();

        try {
            // Note: As discussed, this will likely sign out the instructor.
            // We process them one by one.
            for (const email of validEmails) {
                await this.authService.registerUserByInstructor(
                    email,
                    this.tempPassword,
                    email.split('@')[0], // Default display name
                    this.instructorId
                );
            }

            await loading.dismiss();
            this.showToast('Clientes registrados con éxito. Deberás iniciar sesión nuevamente.', 'success');
            this.navCtrl.navigateRoot('/login');
        } catch (error: any) {
            await loading.dismiss();
            this.showToast('Error al registrar: ' + error.message, 'danger');
        }
    }

    private async showToast(message: string, color: string) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 3000,
            color,
            position: 'bottom'
        });
        toast.present();
    }

    goBack() {
        this.navCtrl.back();
    }
}
