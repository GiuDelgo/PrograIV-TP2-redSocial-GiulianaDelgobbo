import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login', 
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
    }, 
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'registro',
        loadComponent: () => import('./features/auth/registro/registro').then(m => m.Registro),
    },
    {   
        path: 'publicaciones', 
        loadComponent: () => import('./features/posts/publicaciones/publicaciones').then(m => m.Publicaciones),
        canActivate: [authGuard]
    },
    {   
        path: 'post', 
        loadComponent: () => import('./features/posts/post/post').then(m => m.Post),
        canActivate: [authGuard]
    },
    {
        path: 'miperfil',
        loadComponent: () => import('./features/miperfil/miperfil').then(m => m.MiPerfil),
        canActivate: [authGuard]
    },

    { path: '', redirectTo: 'publicaciones', pathMatch: 'full' },
    { path: '**', redirectTo: 'publicaciones' }
];