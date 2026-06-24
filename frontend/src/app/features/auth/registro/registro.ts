import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})

export class Registro implements OnInit {
  errorMessage = signal<string | null>(null);
  registroForm!: FormGroup;
  imagenPerfil: File | null = null; // Para almacenar la imagen seleccionada

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      correo: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*\\d).+$')]],//obliga a tener al menos una mayúscula y un número
      confirmPassword: ['', [Validators.required]],
      nacimiento: ['', [Validators.required, this.dateValidator]],
      descripcion: ['', [Validators.maxLength(500)]],
      foto: [null, [Validators.required]]
    },{ 
      validators: [this.passwordMatchValidator] //REMINDER: A validators le paso una función de tipo ValidatorFn que recibe un AbstractControl y devuelve ValidationError o null. 
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;//REMINDER: Si no hay error, la función debe devolver null. Esto es importante para que Angular sepa que el control es válido. Si devuelve un objeto, Angular lo interpreta como un error y marca el control como inválido.
  }

  dateValidator (control: AbstractControl) : ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const parsedDate = new Date (control.value);

    const minDate = new Date ('01/01/1920');
    const maxDate = new Date();

    if (parsedDate < maxDate && parsedDate > minDate){
      return null
    } else {
      return {dateInvalid : true}
    }      
  }

  onFileChange(event: any) {//eventro que se dispara al seleccionar un archivo en el input de tipo file.
    const file = event.target.files[0];//accedo al elemento que disparó el evento (event.target) y luego a su propiedad files, que es una lista de los archivos seleccionados. En este caso, tomo el primer archivo.
    if (file) {
      this.imagenPerfil = file;
      this.registroForm.patchValue({ foto: file });//actualizo el valor del control 'foto' en el formulario con el archivo seleccionado. Esto es necesario para que el formulario reconozca que se ha seleccionado un archivo y pueda validarlo correctamente.
      this.registroForm.get('foto')?.updateValueAndValidity();//después de actualizar el valor del control, llamo a updateValueAndValidity() para que Angular vuelva a evaluar la validez del control. Esto es importante porque el control 'foto' tiene una validación de required, y al seleccionar un archivo, el control debería pasar de inválido a válido. Sin esta llamada, Angular no se daría cuenta del cambio y el formulario seguiría marcando el control como inválido.
    }
  }

  onSubmit() {
    if (this.registroForm.invalid || !this.imagenPerfil) {
      this.registroForm.markAllAsTouched();
      if (!this.imagenPerfil) this.errorMessage.set('La foto de perfil es obligatoria');
      return;
    }

    this.errorMessage.set(null);

    this.authService.registro(this.registroForm.value, this.imagenPerfil).subscribe({
      next: (response) =>{
        console.log('Registro exitoso', response);
        this.router.navigate(['/publicaciones']);
      }, 
      error: (err) => {
        const mensajeError = err.error?.message || 'Error al registrar el usuario';
        this.errorMessage.set(mensajeError);
      }
    })
  }
}

