import { CanActivateFn, Router } from '@angular/router';
import { computed, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const activeuserGuard: CanActivateFn = (route, state) => {
    const authService = inject (AuthService);

    const isActive = computed(()=>authService.usuarioActual().eliminado === false);

    if (isActive()){
        return true;
    }else {
        return false;
    }
}