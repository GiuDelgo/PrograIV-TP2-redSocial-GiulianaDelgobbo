import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})

export class Registro implements OnInit {
  constructor(private router: Router, private fb: FormBuilder) {}

  errorMessage = signal<string | null>(null);
  registroForm!: FormGroup;
  imagenPerfil: File | null = null; // Para almacenar la imagen seleccionada

  ngOnInit() {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*\\d).+$')]],//obliga a tener al menos una mayúscula y un número
      confirmPassword: ['', [Validators.required]],
      nacimiento: ['', [Validators.required]],
      descripcion: ['', [Validators.maxLength(500)]],
      imagen: [null, [Validators.required]]
    },{ 
      validators: this.passwordMatchValidator //REMINDER: A validators le paso una función de tipo ValidatorFn que recibe un AbstractControl y devuelve ValidationError o null. 
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

  onFileChange(event: any) {//eventro que se dispara al seleccionar un archivo en el input de tipo file.
    const file = event.target.files[0];//accedo al elemento que disparó el evento (event.target) y luego a su propiedad files, que es una lista de los archivos seleccionados. En este caso, tomo el primer archivo con [0].
    if (file) {
      this.imagenPerfil = file;
      this.registroForm.patchValue({ imagen: file });//actualizo el valor del control 'imagen' en el formulario con el archivo seleccionado. Esto es necesario para que el formulario reconozca que se ha seleccionado un archivo y pueda validarlo correctamente.
      this.registroForm.get('imagen')?.updateValueAndValidity();//después de actualizar el valor del control, llamo a updateValueAndValidity() para que Angular vuelva a evaluar la validez del control. Esto es importante porque el control 'imagen' tiene una validación de required, y al seleccionar un archivo, el control debería pasar de inválido a válido. Sin esta llamada, Angular no se daría cuenta del cambio y el formulario seguiría marcando el control como inválido.
    }
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);

    const { nombre, apellido, correo, username, password, confirmPassword, nacimiento, descripcion } = this.registroForm.value;

    if (username === 'FALTA IMPLEMENTAR LOGICA' && password === 'FALTA IMPLEMENTAR LOGICA') {
      this.router.navigate(['/publicaciones']);
    } else {
      this.errorMessage.set('Credenciales inválidas');
    }
  }
}

