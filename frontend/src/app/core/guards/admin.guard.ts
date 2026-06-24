import { CanActivateFn, Router } from '@angular/router';
import { computed, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject (AuthService);
    const router = inject(Router);

    const admin = computed(()=>authService.usuarioActual().perfil === 'administrador')

    if (admin()){
        return true;
    }else {
        router.navigate(['./publicaciones']);
        return false;
    }
}