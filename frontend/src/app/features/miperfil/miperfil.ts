import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Usuario } from '../../shared/interfaces/usuario.interface';
import { Publicacion } from '../../shared/interfaces/publicacion.interface';
import { Comentario } from '../../shared/interfaces/comentario.interface';
import { AuthService } from '../../core/services/auth.service';
import { PublicacionesService } from '../../core/services/publicaciones.service';
import { ComentariosService } from '../../core/services/comentarios.service';
import { forkJoin, map, switchMap, of } from 'rxjs';

interface PublicacionPerfil extends Publicacion {
  ultimosComentarios: Comentario[];
  totalComentarios: number;
}

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './miperfil.html',
  styleUrl: './miperfil.css',
})
export class MiPerfil implements OnInit {
  usuario = signal<Usuario | null>(null);
  ultimasPublicaciones = signal<PublicacionPerfil[]>([]);
  isLoading = signal<boolean>(true);
  isSaving = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  limitePublicaciones = 3;
  limiteComentarios = 5;

  perfilForm!: FormGroup;
  imagenPerfil: File | null = null;
  fotoPreview = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private publicacionesService: PublicacionesService,
    private comentariosService: ComentariosService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      descripcion: ['', [Validators.maxLength(500)]],
      fechaNacimiento: ['', [Validators.required, this.dateValidator]],
    });

    const usuarioSesion = this.authService.usuarioActual();

    if (usuarioSesion) {
      this.cargarDatosPerfil(usuarioSesion);
    } else {
      this.errorMessage.set('No se encontró una sesión activa. Por favor inice sesión');
      this.isLoading.set(false);
    }
  }

  cargarDatosPerfil(usuarioObj: Usuario): void {
    this.usuario.set(usuarioObj);
    this.cargarUltimasPublicaciones(usuarioObj.usuario);
  }

  iniciarEdicion(): void {
    const usuario = this.usuario();
    if (!usuario) return;

    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.imagenPerfil = null;
    this.fotoPreview.set(null);

    this.perfilForm.patchValue({
      descripcion: usuario.descripcion ?? '',
      fechaNacimiento: this.formatDateForInput(usuario.fechaNacimiento),
    });

    this.isEditing.set(true);
  }

  cancelarEdicion(): void {
    this.isEditing.set(false);
    this.imagenPerfil = null;
    this.fotoPreview.set(null);
    this.errorMessage.set(null);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.imagenPerfil = file;
    this.fotoPreview.set(URL.createObjectURL(file));
  }

  guardarPerfil(): void {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { descripcion, fechaNacimiento } = this.perfilForm.value;

    this.authService
      .actualizarPerfil({ descripcion, fechaNacimiento }, this.imagenPerfil)
      .subscribe({
        next: (usuarioActualizado) => {
          this.usuario.set(usuarioActualizado);
          this.isEditing.set(false);
          this.imagenPerfil = null;
          this.fotoPreview.set(null);
          this.isSaving.set(false);
          this.successMessage.set('Perfil actualizado correctamente.');
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(
            err.error?.message?.[0] ??
              err.error?.message ??
              'No se pudo actualizar el perfil.',
          );
        },
      });
  }

  fotoMostrada(): string {
    return this.fotoPreview() ?? this.usuario()?.foto ?? '';
  }

  cargarUltimasPublicaciones(usuario: string): void {
    this.publicacionesService
      .obtenerPublicaciones('createdAt', this.limitePublicaciones, undefined, usuario)
      .pipe(
        switchMap((posts) => {//switchMap para ejecutar nuevas peticiones en base a las publicaciones traídas
          if (posts.length === 0) {
            return of([] as PublicacionPerfil[]);
          }

          return forkJoin(//ejecuto todas las peticiones a la vez, y me trae todas las respuesta a la vez
            posts.map((post) => {
              const totalComentarios = Array.isArray(post.comentarios)
                ? post.comentarios.length
                : 0;

              return this.comentariosService
                .obtenerComentarios(post._id, this.limiteComentarios, 0)//por cada publicación traída voy a buscar sus comentarios
                .pipe(
                  map((comentarios) => ({
                    ...post,
                    ultimosComentarios: comentarios,
                    totalComentarios,
                  })),
                );
            }),
          );
        }),
      )
      .subscribe({
        next: (posts) => {
          this.ultimasPublicaciones.set(posts);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Error al cargar las publicaciones.');
          this.isLoading.set(false);
        },
      });
  }

  private formatDateForInput(fecha: Date | string): string {
    const parsedDate = new Date(fecha);
    if (isNaN(parsedDate.getTime())) return '';
    return parsedDate.toISOString().split('T')[0];
  }

  private dateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const parsedDate = new Date(control.value);
    const minDate = new Date('01/01/1920');
    const maxDate = new Date();

    if (parsedDate < maxDate && parsedDate > minDate) {
      return null;
    }

    return { dateInvalid: true };
  }
}
