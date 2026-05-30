import { IsDateString, IsEmail, IsString, MinLength, Matches, IsOptional } from "class-validator";

export class CreateUsuarioDto {
    @IsString()
    @MinLength(3)
    nombre!: string;

    @IsString()
    @MinLength(3)
    apellido!: string;

    @IsEmail({}, {message:'Dirección de correo inválida'})
    correo!: string;

    @IsString()
    @MinLength(3)
    usuario!: string;

    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
        message: 'La contraseña debe poseer al menos una mayúscula y un número'
    })
    contraseña!: string; 
    
    @IsDateString({}, { message: 'Debe ser una fecha válida' })
    fechaNacimiento!: string; 
    
    @IsString()
    descripcion!: string; 
    
    @IsString()
    @IsOptional()
    foto!: string;
    
    @IsString()
    @IsOptional()
    perfil!: string;
}
