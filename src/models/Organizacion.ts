import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrganizacion {
    name: string;
    usuarios: mongoose.Types.ObjectId[];
}

export interface IOrganizacionModel extends IOrganizacion, Document { }

const OrganizacionSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        usuarios: { type: [Types.ObjectId], ref: 'Usuario' }
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IOrganizacionModel>('Organizacion', OrganizacionSchema);
