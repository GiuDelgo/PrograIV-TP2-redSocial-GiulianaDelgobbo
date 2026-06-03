import { Comentario } from "../comentarios/entities/comentario.entity";
import { IsDateString, IsString, IsNotEmpty } from "class-validator";

export class CreatePublicacionDto {  
    @IsString()    
    _id!: string;

    @IsString()
    @IsNotEmpty()
    titulo!: string;

    @IsString()
    @IsNotEmpty()
    descripcion!: string; 

    @IsString()
    urlImagen!: string;

    @IsString()
    @IsNotEmpty()
    usuarioId!: string;

    @IsString()
    @IsNotEmpty()
    usuarioNombre!: string;

    @IsDateString()
    fechaCreacion!: string;

    @IsString()
    likes!: string[]; // array de IDs de usuarios que dieron me gusta
    
    @IsString()
    comentarios!: Comentario[];
}

