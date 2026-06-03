export interface Comentario {    
    _id: string;
    mensaje: string;
    usuario: { usuario: string; foto: string };
    fecha: Date;
    modificado?: boolean;
}
