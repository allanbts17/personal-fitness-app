import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register-students',
  templateUrl: './register-students.page.html',
  styleUrls: ['./register-students.page.scss'],
  standalone: false
})
export class RegisterStudentsPage {
  students: { email: string }[] = [{ email: '' }];
  tempPassword = '';

  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  addStudent() {
    this.students.push({ email: '' });
  }

  removeStudent(index: number) {
    if (this.students.length > 1) {
      this.students.splice(index, 1);
    }
  }

  async registerStudents() {
    const validEmails = this.students.filter(student => student.email.trim() !== '');

    if (validEmails.length === 0) {
      this.showToast('Agrega al menos un correo válido', 'warning');
      return;
    }

    if (this.tempPassword.length < 6) {
      this.showToast('La contraseña debe tener al menos 6 caracteres', 'warning');
      return;
    }

    const toast = await this.toastCtrl.create({
      message: 'Registrando estudiantes...',
      duration: 2000
    });
    toast.present();

    try {
      const currentUser = await firstValueFrom(this.authService.currentUser$);
      if (!currentUser) {
        this.showToast('Error de sesión, vuelve a intentar.', 'danger');
        return;
      }

      for (const student of validEmails) {
        await this.authService.registerUserByInstructor(
          student.email,
          this.tempPassword,
          'Estudiante',
          currentUser.uid
        );
      }

      this.showToast('Estudiantes registrados con éxito. Por favor inicia sesión de nuevo.', 'success');
      setTimeout(async () => {
        await this.authService.logout();
        this.router.navigateByUrl('/login');
      }, 1000);

    } catch (error: any) {
      console.error(error);
      this.showToast('Error al registrar estudiantes: ' + error.message, 'danger');
    }
  }

  async showToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color
    });
    toast.present();
  }
}
