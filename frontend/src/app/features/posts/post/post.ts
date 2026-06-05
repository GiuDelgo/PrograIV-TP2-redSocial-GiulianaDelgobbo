import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PublicacionesService } from '../../../core/services/publicaciones.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-post',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './post.html',
  styleUrl: './post.css',
})

export class Post implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>; //referencia local al input para poder limpiar su value binario

  errorMessage = signal<string | null>(null);

  postForm!: FormGroup;
  fotoSeleccionada: File | null = null;
  vistaPrevia: string | null = null;
  cargando = signal<boolean>(false);
  usuarioId = '';
  usuarioNombre = '';

  constructor( private fb: FormBuilder, private publicacionesService: PublicacionesService, private authService : AuthService) {}

  ngOnInit() {
    this.postForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(700)]],
    });

    const usuarioSesion = this.authService.usuarioActual();

    if (usuarioSesion){
      this.usuarioId = usuarioSesion._id;
      this.usuarioNombre = usuarioSesion.usuario;
    }else{
      this.errorMessage.set('No se encontró una sesión activa. Por favor inice sesión')
      this.cargando.set(false);
    }
  }  

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
    
      if (!file.type.match(/image\/(jpg|jpeg|png)$/)) {
        alert('Solo se permiten imágenes (jpg, jpeg, png)');
        return;
      }
    
      this.fotoSeleccionada = file;
    }
  }

  // remuevo la foto seleccionada antes de enviar
  quitarFoto() {
    this.fotoSeleccionada = null;
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = ''; // Resetea el puntero del archivo nativo
    }
  }

  enviarPost() {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }


    this.cargando.set(true)
    const { titulo, descripcion } = this.postForm.value;

    // Enviamos los datos al servicio que armará el FormData
    this.publicacionesService.subirPublicacion(titulo, descripcion, this.usuarioId, this.usuarioNombre, this.fotoSeleccionada || undefined)
      .subscribe({
        next: () => {
          this.postForm.reset(); //reseto el formgroup para limpiar los campos de texto
          this.quitarFoto();//borro foto seleccionada para limpiar el input file
          this.cargando.set(false);
        },
        error: (err) => {
          const mensajeError = 'Hubo un error al subir la publicación. Intentalo de nuevo.';
          console.log(err.error?.message);
          this.errorMessage.set(mensajeError);
          this.cargando.set(false);
        }
      });
  }

}

