import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty({ message: 'El usuario es obligatorio' })
    readonly usuario!: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    readonly contrasena!: string;
}