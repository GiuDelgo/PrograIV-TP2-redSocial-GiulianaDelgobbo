import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {}

  errorMessage = signal<string | null>(null);
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*\\d).+$')]]//obliga a tener al menos una mayúscula y un número
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();//Angular sólo muestra los errores de form cuando todos los campos figuran como tocados
      return;
    }

    // Limpia el error viejo antes de verificar las credenciales
    this.errorMessage.set(null);

    const { username, password } = this.loginForm.value;
  
    this.authService.login(username, password).subscribe({
    next: (response) => {
      console.log('Login exitoso', response);

      // Sprint #3 aca guarda el JWT devuelto en el localStorage.
      this.router.navigate(['/publicaciones']);
    },
    error: (err) => {
      const mensajeError = err.error?.message || 'Credenciales inválidas';
      this.errorMessage.set(mensajeError);
    }
    });
  }
}
