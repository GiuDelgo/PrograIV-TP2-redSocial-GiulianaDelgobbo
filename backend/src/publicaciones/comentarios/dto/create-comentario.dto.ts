import { IsString, MinLength, MaxLength, IsNotEmpty } from "class-validator";

export class CreateComentarioDto {
    @IsString()
    @IsNotEmpty()
    publicacionId!:string;

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
