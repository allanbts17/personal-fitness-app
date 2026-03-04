import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';
import { AuthRedirectGuard } from './guards/auth-redirect.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
        canActivate: [AuthRedirectGuard]
    },
    {
        path: 'admin',
        loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminPageModule),
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
    },
    {
        path: 'instructor',
        loadChildren: () => import('./pages/instructor/instructor.module').then(m => m.InstructorPageModule),
        canActivate: [RoleGuard],
        data: { roles: ['instructor'] }
    },
    {
        path: 'user',
        loadChildren: () => import('./pages/user/user.module').then(m => m.UserPageModule),
        canActivate: [RoleGuard],
        data: { roles: ['user'] }
    },
    {
        path: 'register',
        loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
    },
    {
        path: 'routine-execution/:id',
        loadChildren: () => import('./pages/user/routine-execution/routine-execution.module').then(m => m.RoutineExecutionPageModule)
    }

];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
