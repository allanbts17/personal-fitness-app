import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
    },
    {
        path: 'admin',
        loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminPageModule),
        //canActivate: [RoleGuard],
        data: { roles: ['admin'] }
    },
    {
        path: 'instructor',
        loadChildren: () => import('./pages/instructor/instructor.module').then(m => m.InstructorPageModule),
        //canActivate: [RoleGuard],
        data: { roles: ['instructor'] }
    },
    {
        path: 'user',
        loadChildren: () => import('./pages/user/user.module').then(m => m.UserPageModule),
        //canActivate: [RoleGuard],
        data: { roles: ['user'] }
    },  {
    path: 'manage-routines',
    loadChildren: () => import('./pages/instructor/manage-routines/manage-routines.module').then( m => m.ManageRoutinesPageModule)
  },
  {
    path: 'clients',
    loadChildren: () => import('./pages/instructor/clients/clients.module').then( m => m.ClientsPageModule)
  },

];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
