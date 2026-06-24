import { IsNotEmpty, IsString } from 'class-validator';

export class AltaDto {
    @IsString()
    @IsNotEmpty({ message: 'El id de usuario es obligatorio' })
    readonly _id!: string;
}