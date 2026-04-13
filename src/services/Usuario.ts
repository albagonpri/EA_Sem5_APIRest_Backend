import mongoose from 'mongoose';
import Usuario, { IUsuarioModel, IUsuario } from '../models/Usuario';
import OrganizacionService from './Organizacion';
import ActividadService from './Actividad';

const createUsuario = async (data: Partial<IUsuario>): Promise<IUsuarioModel> => {
    const usuario = new Usuario({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });

    const savedUsuario = await usuario.save();

    if (data.organizacion) {
        await OrganizacionService.addUsuarioToOrganizacion(data.organizacion as string, savedUsuario._id);
    }

    await ActividadService.createActividad({
        entityType: 'usuario',
        actionType: 'create',
        description: `Se ha creado el usuario ${savedUsuario.name}`
    });

    return savedUsuario;
};

const getUsuario = async (usuarioId: string): Promise<IUsuarioModel | null> => {
    return await Usuario.findById(usuarioId).populate('organizacion');
};

const getAllUsuarios = async (): Promise<IUsuarioModel[]> => {
    return await Usuario.find().populate('organizacion');
};

const updateUsuario = async (usuarioId: string, data: Partial<IUsuario>): Promise<IUsuarioModel | null> => {
    const usuario = await Usuario.findById(usuarioId);

    if (usuario) {
        const previousName = usuario.name;

        if (data.organizacion !== undefined) {
            const newOrg = data.organizacion ? data.organizacion.toString() : '';
            const oldOrg = usuario.organizacion ? usuario.organizacion.toString() : '';

            if (newOrg !== oldOrg) {
                if (oldOrg !== '') {
                    await OrganizacionService.removeUsuarioFromOrganizacion(usuario.organizacion, usuario._id);
                }

                if (newOrg !== '') {
                    await OrganizacionService.addUsuarioToOrganizacion(data.organizacion as string, usuario._id);
                }
            }

            if (newOrg === '') {
                data.organizacion = null as any;
            }
        }

        usuario.set(data);
        const updatedUsuario = await usuario.save();

        await ActividadService.createActividad({
            entityType: 'usuario',
            actionType: 'update',
            description: `Se ha actualizado el usuario ${updatedUsuario.name || previousName}`
        });

        return updatedUsuario;
    }

    return null;
};

const deleteUsuario = async (usuarioId: string): Promise<IUsuarioModel | null> => {
    const deletedUsuario = await Usuario.findByIdAndDelete(usuarioId);

    if (deletedUsuario && deletedUsuario.organizacion) {
        await OrganizacionService.removeUsuarioFromOrganizacion(deletedUsuario.organizacion, deletedUsuario._id);
    }

    if (deletedUsuario) {
        await ActividadService.createActividad({
            entityType: 'usuario',
            actionType: 'delete',
            description: `Se ha eliminado el usuario ${deletedUsuario.name}`
        });
    }

    return deletedUsuario;
};

export default {
    createUsuario,
    getUsuario,
    getAllUsuarios,
    updateUsuario,
    deleteUsuario
};