import mongoose, { Document, Schema } from 'mongoose';

export interface IActividad {
    entityType: 'usuario' | 'organizacion';
    actionType: 'create' | 'update' | 'delete';
    description: string;
}

export interface IActividadModel extends IActividad, Document {}

const ActividadSchema: Schema = new Schema(
    {
        entityType: { type: String, required: true, enum: ['usuario', 'organizacion'] },
        actionType: { type: String, required: true, enum: ['create', 'update', 'delete'] },
        description: { type: String, required: true }
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model<IActividadModel>('Actividad', ActividadSchema);