import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicacionDto } from './create-publicacion.dto';
import { IsString, IsNotEmpty, MinLength, MaxLength} from "class-validator";


export class UpdatePublicacionDto extends PartialType(CreatePublicacionDto) {
    @IsString()
    @MinLength(3)
    @MaxLength(300)
    @IsNotEmpty()
    descripcion!: string;
}
