import { Routes } from '@angular/router';

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
        loadComponent: () => import('./features/posts/publicaciones/publicaciones').then(m => m.Publicaciones)
    },
    {   
        path: 'post', 
        loadComponent: () => import('./features/posts/post/post').then(m => m.Post)
    },
    {
        path: 'miperfil',
        loadComponent: () => import('./features/miperfil/miperfil').then(m => m.MiPerfil)
    }
];