import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss']
})
export class LoginPage {
    email = '';
    password = '';

    constructor(private auth: AuthService, private router: Router) { }

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
        } catch (err) {
            console.error(err);
            alert('Login failed: ' + (err as any).message);
        }
    }
}
