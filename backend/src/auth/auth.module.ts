import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';
import { PublicacionesModule } from '../publicaciones/publicaciones.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsuariosModule,
    PublicacionesModule,
    JwtModule.register({
      global:true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m'},
    })
  ]
})
export class AuthModule {}
