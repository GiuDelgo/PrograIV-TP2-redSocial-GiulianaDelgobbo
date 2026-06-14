import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

//este intercptor captura los errores del back y si el usuario no está autenticado lo desloguea y redirige al login
export const authInterceptor: HttpInterceptorFn = (req, next) =>{
    const router = inject(Router);

    const clonedRequest = req.clone ({ //clono las peticiones del front agregandoles withCredentials: true globalmente pq mi front y back tienen dominios distintos. 
        withCredentials: true
    });

    return next (clonedRequest).pipe(//next envía la petición al siguiente interceptor o al servidor
        catchError((error: HttpErrorResponse) =>{//catchError es un operador RxJS que intercepta errores producidos en la petición HTTP.
            if (error.status === 401){//contiene la info del error devuelto por el backend
                localStorage.removeItem('usuario_sesion');
                router.navigate(['/login']);
            }
            return throwError (() => error);//relanzo el error para que no se quede en el interceptor y llegue al componente
        })
    )
}