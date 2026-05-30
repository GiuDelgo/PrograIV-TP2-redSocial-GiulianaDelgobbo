import { IsDateString, IsString } from "class-validator";

export class CreateUsuarioDto {
    @IsString()
    nombre!: string;

    @IsString()
    apellido!: string;

    @IsString()
    correo!: string;

    @IsString()
    usuario!: string;

    @IsString()
    contraseña!: string; 
    
    @IsDateString()
    fechaNacimiento!: Date; 
    
    @IsString()
    descripcion!: string; 
    
    @IsString()
    foto!: string;
    
    @IsString()
    perfil!: string;
}
