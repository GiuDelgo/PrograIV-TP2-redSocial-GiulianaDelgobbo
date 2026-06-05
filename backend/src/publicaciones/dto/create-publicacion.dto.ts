import { Comentario } from "../comentarios/entities/comentario.entity";
import { IsDateString, IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreatePublicacionDto {  
    @IsString()
    @IsNotEmpty()
    titulo!: string;

    @IsString()
    @IsNotEmpty()
    descripcion!: string; 

    @IsString()
    @IsOptional()
    urlImagen!: string;

    @IsString()
    @IsNotEmpty()
    usuarioId!: string;

    @IsString()
    @IsNotEmpty()
    usuarioNombre!: string;

    @IsString()
    @IsOptional()
    likes!: string[]; // array de IDs de usuarios que dieron me gusta
    
    @IsString()
    @IsOptional()
    comentarios!: Comentario[];
}

