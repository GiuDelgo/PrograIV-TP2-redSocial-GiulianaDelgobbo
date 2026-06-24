import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, Form, AbstractControl, ValidationErrors } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Usuario } from '../../shared/interfaces/usuario.interface';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {
  usuarios = signal<Usuario[]>([]);
  cargando = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  
  registroForm!: FormGroup;
  imagenPerfil: File | null = null;
  nombreFoto = signal<string | null>(null);

  constructor(private fb: FormBuilder, private adminService: AdminService){}

  ngOnInit(): void {
    this.cargarUsuarios();

    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      correo: ['', [Validators.required, Validators.email]],
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      contrasena: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*\\d).+$')]],//obliga a tener al menos una mayúscula y un número
      confirmPassword: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required, this.dateValidator]],
      descripcion: ['', [Validators.maxLength(500)]],
      foto: [null, [Validators.required]], 
      perfil: ['usuario', [Validators.required]]
    },{ 
      validators: [this.passwordMatchValidator] //REMINDER: A validators le paso una función de tipo ValidatorFn que recibe un AbstractControl y devuelve ValidationError o null. 
    });
    
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const contrasena = control.get('contrasena');
    const confirmPassword = control.get('confirmPassword');

    if (contrasena && confirmPassword && contrasena.value !== confirmPassword.value) {
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

  cargarUsuarios():void{
    this.cargando.set(true);
    this.adminService.getusuariosAdmin().subscribe({
      next:(res)=>{
        this.usuarios.set(res);
        this.cargando.set(false);
      }, 
      error: ()=>{
        this.errorMessage.set('Error al cargar usuarios.');
        this.cargando.set(false);
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenPerfil = file;
      this.registroForm.patchValue({ foto: file });
      this.registroForm.get('foto')?.updateValueAndValidity();
    }
  }

  onSubmit(){
    if (this.registroForm.invalid){
      this.registroForm.markAllAsTouched();
      return;
    }

    if (!this.imagenPerfil){
      this.errorMessage.set('La foto de perfil es obligatoria');
      return
    } 

    this.cargando.set(true);
    this.errorMessage.set(null);

    this.adminService.registrarUsuarioAdmin(this.registroForm.value, this.imagenPerfil).subscribe({
      next: ()=>{
        this.successMessage.set('Usuario creado correctamente por administración.');
        this.registroForm.reset({ perfil: 'usuario' });
        this.imagenPerfil = null;
        this.cargarUsuarios();
      },
      error:(err)=>{
        this.errorMessage.set(err.error?.message || 'Hubo un error al crear el usuario.');
        this.cargando.set(false);
      }
    });
  }

  toggleEstadoUsuario(usuario:any):void{
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (!usuario.eliminado) {
      this.adminService.bajaUsuario(usuario._id).subscribe({
        next: ()=>{
          this.successMessage.set(`Usuario ${usuario.usuario} deshabilitado con éxito.`);
          this.cargarUsuarios();
        },
        error: (err) => this.errorMessage.set(err.error?.message || 'No se pudo deshabilitar el usuario.')
      });
    }else{
      this.adminService.altaUsuario(usuario._id).subscribe({
        next: ()=>{
          this.successMessage.set('Usuario ${usuario.usuario} habilitado con éxito.');
          this.cargarUsuarios();
        },
        error:(err) => this.errorMessage.set(err.error?.message || 'No se pudo habilitar al usuario.')
      });
    }
  }
}
