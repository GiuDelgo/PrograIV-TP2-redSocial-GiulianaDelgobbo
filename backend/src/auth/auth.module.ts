import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsuariosModule,
    JwtModule.register({
      global:true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1m'},
    })
  ]
})
export class AuthModule {}
