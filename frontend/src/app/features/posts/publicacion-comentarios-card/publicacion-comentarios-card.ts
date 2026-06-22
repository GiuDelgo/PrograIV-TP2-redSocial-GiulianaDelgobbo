import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { Publicacion } from '../../../shared/interfaces/publicacion.interface';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ComentariosService } from '../../../core/services/comentarios.service';
import { Comentario } from '../../../shared/interfaces/comentario.interface'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-publicacion-comentarios-card',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publicacion-comentarios-card.html',
  styleUrl: './publicacion-comentarios-card.css',
})
export class PublicacionComentariosCard implements OnInit, OnDestroy{
  @Input({ required: true }) publicacion!: Publicacion;
  @Input({ required: true }) idUsuarioLogueado!: string;
  @Output() onClose = new EventEmitter<void>();

  comentForm!: FormGroup;

  usuarioString = localStorage.getItem('usuario_sesion');
  usuarioId = '';
  usuarioNombre = '';

  comentarios = signal<Comentario[]>([]);
  limite: number = 5; 
  offset: number = 0;
  totalComentarios: number = 0;

  cargandoMas = false; 
  finDeContenido = false;

  modoEdicion = false;
  comentarioIdSeleccionado: string | null = null;

  private comentSub!: Subscription;

  errorMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder, private comentariosService: ComentariosService){}

  ngOnInit() {
    this.cargarComentarios();

    this.comentForm = this.fb.group({
      comentario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(300)]],
    });

    if (this.usuarioString !== null){
      const usuario = JSON.parse(this.usuarioString);            
      this.usuarioId = usuario._id;
      this.usuarioNombre = usuario.usuario;
    }

    this.comentSub = this.comentariosService.comentarioCreado$.subscribe(()=>{
      this.offset = 0;
      this.finDeContenido = false;
      this.comentarios.set([]);

      this.cargarComentarios();
    })
  }

  ngOnDestroy(): void {
    this.comentSub.unsubscribe();
  }

  // Al presionar la "X" o "Cerrar" en este componente, ejecuto esto:
  notificarCierre() {
    this.onClose.emit();
  }

  enviarComentario(){
    if (this.comentForm.invalid) {
      this.comentForm.markAllAsTouched();
      return;
    }

    const { comentario } = this.comentForm.value;

    //PUT
    if (this.modoEdicion && this.comentarioIdSeleccionado) {
      this.comentariosService.editarComentario(this.comentarioIdSeleccionado, comentario)
        .subscribe({
          next: () => {
            this.cancelarEdicion();
            // El subject comentarioCreado$ se encargará de refrescar la lista automáticamente
            // this.comentariosService.notificarCambioComentario(); 
          },
          error: (err) => {
            this.errorMessage.set('Hubo un error al editar el comentario.');
            console.log(err.error?.message);
          }
        });
    } else {
      //POST
      this.comentariosService.comentarPublicacion(this.publicacion._id, this.usuarioId, this.usuarioNombre, comentario)
        .subscribe({
          next: () => {
            this.comentForm.reset(); //reseto el formgroup para limpiar los campos de texto
          },
          error: (err) => {
            const mensajeError = 'Hubo un error al subir el comentario. Intentalo de nuevo.';
            console.log(err.error?.message);
          }
        });
      }
  }

  cargarComentarios(){
    if (this.cargandoMas || this.finDeContenido) return;

    this.cargandoMas = true;

    this.comentariosService.obtenerComentarios(this.publicacion._id, this.limite, this.offset).subscribe({
      next: (res) => {

        // si el back devuelve menos que el límite, alcanzo el final definitivo
        if (res.length < this.limite){
          this.finDeContenido = true;
        }

        // si el offset es 0, pisa con los datos nuevos; si es mayor, concatena
        if (this.offset === 0) {
        this.comentarios.set(res);
      } else {
        this.comentarios.update(c => [...c, ...res]);//concateno al array con el limite de comentarios los nuevos comentarios
      }

        this.offset += this.limite;

        this.cargandoMas = false;
        this.errorMessage.set(null);
      },
      error: (err) => {
        this.cargandoMas = false; // apagar el spinner en caso de error
        const mensajeError = err.error?.message || 'Error al cargar comentarios';
        this.errorMessage.set(mensajeError)
      }
    });
  }

  onCommentsScroll(event: Event) {
    const element = event.target as HTMLElement;

    const posicionActual =
      element.scrollTop + element.clientHeight;

    const alturaTotal = element.scrollHeight;

    if (posicionActual >= alturaTotal - 100) {
      this.cargarComentarios();
    }
  }

  editarComentario(comment: Comentario) {
    // Opcional: Solo permitir editar si el comentario pertenece al usuario logueado
    if (comment.usuarioId !== this.usuarioId) return;

    this.modoEdicion = true;
    this.comentarioIdSeleccionado = comment._id;

    // Captura la descripción actual y la setea en el input del formulario
    this.comentForm.setValue({
      comentario: comment.descripcion
    });
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.comentarioIdSeleccionado = null;
    this.comentForm.reset();
  }
}
