import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Comentario {
    @Prop({required:true})
    publicacionId!:string;
    
    @Prop({required:true})
    usuarioId!:string;

    @Prop({required:true})
    usuarioNombre!:string

    @Prop({required:true})
    descripcion!:string;

    @Prop({ required: true, default: false })
    editado!:boolean;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);

