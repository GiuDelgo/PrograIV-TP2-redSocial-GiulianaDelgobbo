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
    ConfigModule.forRoot(), //config lee la variables de entorno del archivo .env, las carga en process.env y disponibiliza en scope global
    MongooseModule.forRoot(process.env.MONGO_URI_PROD!),//conexión a atlas 
    //MongooseModule.forRoot(process.env.MONGO_URI!),//conexión local
    
    // Configuración del puente para servir las imágenes
    //Si no estoy en producción, agrega ServeStaticModule a los imports para que Nest sirva los archivos de la carpeta uploads. Si estoy en producción, no agrega nada
    ...(process.env.NODE_ENV !== 'production' ? [//spreadeo el array de imports, si es true configura local, si es false queda vacío
    ServeStaticModule.forRoot({//sólo entra acá cuando la app no está en producción 
      rootPath: join(__dirname, '..', 'uploads'),//sirve todo lo que este en la carpeta uploads
      serveRoot: '/uploads',//desde la url publica /uploads
    }),
  ] : []),

    AuthModule, 
    UsuariosModule, 
    PublicacionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
