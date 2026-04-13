import mongoose from 'mongoose';
import Actividad, { IActividad, IActividadModel } from '../models/Actividad';

const createActividad = async (data: Partial<IActividad>): Promise<IActividadModel> => {
    const actividad = new Actividad({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });

    return await actividad.save();
};

const getAllActividades = async (): Promise<IActividadModel[]> => {
    return await Actividad.find().sort({ createdAt: -1 });
};

export default {
    createActividad,
    getAllActividades
};