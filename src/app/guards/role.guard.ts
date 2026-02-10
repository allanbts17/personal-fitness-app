import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const expectedRoles: string[] = route.data['roles'];

        return this.auth.currentUser$.pipe(
            take(1),
            map(user => {
                if (!user) return false;
                return expectedRoles.includes(user.role);
            }),
            tap(hasAccess => {
                if (!hasAccess) {
                    this.router.navigate(['/login']);
                }
            })
        );
    }
}
