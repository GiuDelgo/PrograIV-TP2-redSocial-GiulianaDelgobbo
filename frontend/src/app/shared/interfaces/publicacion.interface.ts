import { Comentario } from "./comentario.interface";

export interface Publicacion {
    _id: string;
    titulo: string;
    descripcion: string; // **nombrar igual en el dto del backend para evitar confusiones**
    urlImagen?: string;
    usuarioId: string;
    usuarioNombre: string;
    fechaCreacion: string;
    likes: string[]; // array de IDs de usuarios que dieron me gusta
    comentarios: Comentario[];
}