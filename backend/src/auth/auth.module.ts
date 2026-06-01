import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from '../usuarios/entities/usuario.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsuariosModule]
})
export class AuthModule {}
