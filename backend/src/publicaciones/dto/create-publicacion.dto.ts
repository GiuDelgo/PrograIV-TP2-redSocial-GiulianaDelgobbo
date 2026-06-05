import { Comentario } from "../comentarios/entities/comentario.entity";
import { IsArray, IsString, IsNotEmpty, IsOptional} from "class-validator";

export class CreatePublicacionDto {  
    @IsString()
    @IsNotEmpty()
    titulo!: string;

    @IsString()
    @IsNotEmpty()
    descripcion!: string; 

    @IsString()
    @IsNotEmpty()
    usuarioId!: string;

    @IsString()
    @IsNotEmpty()
    usuarioNombre!: string;
}

