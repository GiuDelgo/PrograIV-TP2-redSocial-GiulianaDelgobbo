import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePerfilDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Debe ser una fecha válida' })
  fechaNacimiento?: string;
}
