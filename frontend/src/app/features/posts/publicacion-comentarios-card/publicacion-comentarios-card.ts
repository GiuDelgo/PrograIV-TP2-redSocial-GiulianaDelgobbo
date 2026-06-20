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
  usuario = '';

  comentarios = signal<Comentario[]>([]);
  limite: number = 5; 
  offset: number = 0;
  totalComentarios: number = 0;

  cargandoMas = false; 
  finDeContenido = false;

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
      this.usuario = usuario.usuario;
    }

    this.comentSub = this.comentariosService.comentarioCreado$.subscribe(()=>{
      this.offset = 0;
      this.cargarComentarios();
    })
  }

  ngOnDestroy(): void {
    this.comentSub.unsubscribe();
  }
  // Al presionar la "X" o "Cerrar" en este componente, ejecutás esto:
  notificarCierre() {
    this.onClose.emit();
  }

  enviarComentario(){
    if (this.comentForm.invalid) {
      this.comentForm.markAllAsTouched();
      return;
    }

    const { comentario } = this.comentForm.value;

    this.comentariosService.comentarPublicacion(this.publicacion._id, this.usuarioId, this.usuario, comentario)
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

  cargarComentarios(){
    if (this.cargandoMas || this.finDeContenido) return;

    this.cargandoMas = true;

    this.comentariosService.obtenerComentarios(this.publicacion._id, this.limite, this.offset).subscribe({
      next: (res) => {

        if (res.length < this.limite){
          this.finDeContenido = true;
        }

        this.comentarios.update(c =>  [...c, ...res])//concateno al array con el limite de comentarios los nuevos comentarios

        this.offset += this.limite;

        this.cargandoMas = false;
        this.errorMessage.set(null);
      },
      error: (err) => {
        const mensajeError = err.error?.message || 'Error al cargar comentarios';
        this.errorMessage.set(mensajeError)
      }
    });
  }

  onWindowScroll() {
  // Calculo la posición actual del scroll
  const posicionActual = window.innerHeight + window.scrollY;

  // Calculo la altura total de la página web
  const alturaTotal = document.documentElement.scrollHeight;

  // Si el usuario está a menos de 200px del fondo, disparo la carga
  if (posicionActual >= alturaTotal - 200) {
    this.cargarComentarios();
  }
}
}
