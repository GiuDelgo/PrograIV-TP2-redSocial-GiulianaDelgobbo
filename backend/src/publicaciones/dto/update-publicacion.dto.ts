import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicacionDto } from './create-publicacion.dto';
import { IsArray, IsString, IsNotEmpty, IsOptional} from "class-validator";


export class UpdatePublicacionDto extends PartialType(CreatePublicacionDto) {
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
