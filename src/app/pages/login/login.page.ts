import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: false
})
export class LoginPage {
    email = '';
    password = '';
    showPassword = false;

    constructor(
        private auth: AuthService,
        private router: Router,
        private toastController: ToastController
    ) { }

    async login() {
        try {
            await this.auth.login(this.email, this.password);
            this.auth.currentUser$.subscribe(profile => {
                if (profile) {
                    if (profile.role === 'admin') this.router.navigate(['/admin/dashboard']);
                    else if (profile.role === 'instructor') this.router.navigate(['/instructor/dashboard']);
                    else this.router.navigate(['/user/home']);
                }
            });
        } catch (err: any) {
            console.error(err);
            let message = '';
            switch (err.code) {
                case 'auth/invalid-email':
                    message = 'El correo electrónico no es válido.';
                    break;
                case 'auth/invalid-credential':
                    message = 'La contraseña es incorrecta.';
                    break;
                default:
                    message = 'Error al iniciar sesión. Intenta nuevamente.';
            }
            const toast = await this.toastController.create({
                message: 'Error al iniciar sesión: ' + message,
                duration: 3000,
                color: 'danger',
                position: 'bottom'
            });
            await toast.present();
        }
    }
}
