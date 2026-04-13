import { NextFunction, Request, Response } from 'express';
import ActividadService from '../services/Actividad';

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const actividades = await ActividadService.getAllActividades();
        return res.status(200).json(actividades);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export default {
    readAll
};