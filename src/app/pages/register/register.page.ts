import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalConfigService, AppConfig } from 'src/app/services/global-config.service';
import { ToastController } from '@ionic/angular';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {
  email = '';
  password = '';
  selectedGroup: number | null = null;
  showPassword = false;

  availableGroups: number[] = [];
  config: AppConfig | null = null;
  isLoading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private globalConfig: GlobalConfigService,
    private toastCtrl: ToastController,
    private firestore: Firestore
  ) { }

  ngOnInit() {
    this.globalConfig.config$.subscribe(conf => {
      this.config = conf;
      if (conf && conf.groupRange && conf.groupRange.length === 2) {
        const start = conf.groupRange[0];
        const end = conf.groupRange[1];
        this.availableGroups = [];
        for (let i = start; i <= end; i++) {
          this.availableGroups.push(i);
        }
      }
    });
  }

  async register() {
    if (!this.email || !this.password || !this.selectedGroup) {
      this.showToast('Por favor completa todos los campos obligatorios.', 'warning');
      return;
    }

    if (!this.config) {
      this.showToast('Configuración no cargada aún. Intenta nuevamente.', 'warning');
      return;
    }

    // 1. Validate email domain or exceptions
    const emailLower = this.email.toLowerCase().trim();
    const isException = this.config.email.exceptions.includes(emailLower);
    const hasValidDomain = emailLower.endsWith('@' + this.config.email.validDomain);

    if (!isException && !hasValidDomain) {
      this.showToast(`El correo debe pertenecer al dominio @${this.config.email.validDomain}.`, 'danger');
      return;
    }

    // 2. Validate group limits
    this.isLoading = true;
    try {
      const usersRef = collection(this.firestore, 'users');
      const q = query(
        usersRef,
        where('role', '==', 'user'),
        where('group', '==', this.selectedGroup)
      );
      const snapshot = await getDocs(q);
      const currentCount = snapshot.size;

      const limit = this.config.studentLimitsPerGroup[1] || 30; // Max limit usually at index 1
      if (currentCount >= limit) {
        this.showToast(`El curso ${this.selectedGroup} ya no tiene cupos disponibles.`, 'danger');
        this.isLoading = false;
        return;
      }

      // 3. Register user
      const userCredential = await this.auth.register(emailLower, this.password);

      // 4. Extract name and lastname from email prefix
      const prefix = emailLower.split('@')[0];
      let name = prefix;
      let lastname = '';

      for (const splitter of this.config.nameSplitter) {
        if (prefix.includes(splitter)) {
          const parts = prefix.split(splitter);
          name = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
          lastname = parts.slice(1).join(splitter);
          lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1);
          break;
        }
      }

      // 5. Create user profile in Firestore
      const { doc, setDoc } = await import('@angular/fire/firestore');
      const docRef = doc(this.firestore, `users/${userCredential.user.uid}`);

      await setDoc(docRef, {
        uid: userCredential.user.uid,
        email: emailLower,
        role: 'user',
        group: this.selectedGroup,
        name: name,
        lastname: lastname,
        displayName: `${name} ${lastname}`.trim()
      });

      this.showToast('Cuenta creada con éxito. Iniciando sesión...', 'success');
      this.router.navigate(['/user/home']);

    } catch (err: any) {
      console.error(err);
      this.showToast('Error al registrar: ' + err.message, 'danger');
    } finally {
      this.isLoading = false;
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
