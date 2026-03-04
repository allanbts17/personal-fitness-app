import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthRedirectGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.auth.currentUser$.pipe(
            take(1),
            map(user => {
                if (user) {
                    // Redirect based on role
                    if (user.role === 'admin') {
                        this.router.navigate(['/admin/dashboard']);
                    } else if (user.role === 'instructor') {
                        this.router.navigate(['/instructor/dashboard']);
                    } else {
                        this.router.navigate(['/user/home']);
                    }
                    return false;
                }
                return true;
            })
        );
    }
}
