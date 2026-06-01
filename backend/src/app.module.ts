import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { ServeStaticModule } from '@nestjs/serve-static'; //Importación obligatoria
import { join } from 'path'; //Herramienta nativa de Node

@Module({
  imports: [
    ConfigModule.forRoot(), //config va antes que la conexión a atlas
    MongooseModule.forRoot(process.env.MONGO_URI_PROD!),//conexión a atlas 
    //MongooseModule.forRoot(process.env.MONGO_URI!),//conexión local
    
    // Configuración del puente para servir las imágenes
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Apunta a la carpeta raíz /uploads
      serveRoot: '/uploads', // Prefijo de la URL pública
    }),

    AuthModule, 
    UsuariosModule, 
    PublicacionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
