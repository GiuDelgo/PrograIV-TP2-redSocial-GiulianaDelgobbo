import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject (AuthService);
    const router = inject(Router);

    return authService.validarToken().pipe(
        map((usuarioPayload) => {
            authService.iniciarContador();
            return true;
        }),//espera a que el servidor responda con el observable, si responde con el payload, el acceso es correcto, transforma el observable a true
        catchError(()=>{
            authService.logout();
            router.navigate(['./login']);
            return of (false);//retorna un observable que tiene el valor false
        })
    );
}