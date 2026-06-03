import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { Comentario } from "../comentarios/entities/comentario.entity";

@Schema({ timestamps: true })
export class Publicacion {
    @Prop({required:true})
    titulo!: string;

    @Prop({required:true})
    descripcion!: string; 

    @Prop({ required: false, default:''})
    urlImagen!: string;

    @Prop({required:true})
    usuarioId!: string;

    @Prop({required:true})
    usuarioNombre!: string;

    @Prop({ required: false, default: [] })    
    likes!: string[]; // array de IDs de usuarios que dieron me gusta
    
    @Prop({ required: false, default: [] })
    comentarios!: Comentario[];
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);

