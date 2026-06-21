export interface Comentario {    
    _id: string;
    publicacionId: string;
    usuarioId: string;
    usuarioNombre: string;
    descripcion: string; 
    editado: boolean;
    createdAt: Date;
    updatedAt: Date;
}
