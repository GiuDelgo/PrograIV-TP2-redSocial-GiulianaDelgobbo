export interface Usuario {
    _id?: string;
    nombre: string;
    apellido: string;
    correo: string;
    usuario: string;
    descripcion?: string;
    foto: string;
    perfil: string;
    fechaNacimiento: Date | string;
    eliminado: boolean
}