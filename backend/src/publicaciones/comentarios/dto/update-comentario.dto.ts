import { PartialType } from '@nestjs/mapped-types';
import { CreateComentarioDto } from './create-comentario.dto';
import { IsString, IsNotEmpty, MinLength, MaxLength} from "class-validator";

export class UpdateComentarioDto extends PartialType(CreateComentarioDto) {
    @IsString()
    @IsNotEmpty()
    usuarioId!:string;

    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    usuario!:string

    @IsString()
    @MinLength(3)
    @MaxLength(300)
    @IsNotEmpty()
    descripcion!:string;
}
