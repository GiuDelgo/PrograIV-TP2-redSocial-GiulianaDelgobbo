import { Comentario } from "../comentarios/entities/comentario.entity";
import { IsString, IsNotEmpty, MaxLength} from "class-validator";

export class CreatePublicacionDto {  
    @IsString()
    @IsNotEmpty()
    titulo!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(700)
    descripcion!: string; 

    @IsString()
    @IsNotEmpty()
    usuarioId!: string;

    @IsString()
    @IsNotEmpty()
    usuarioNombre!: string;
}

