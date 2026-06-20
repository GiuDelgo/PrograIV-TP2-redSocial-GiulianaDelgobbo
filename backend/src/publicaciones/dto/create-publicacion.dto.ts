import { Comentario } from "../comentarios/entities/comentario.entity";
import { IsString, IsNotEmpty} from "class-validator";

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

