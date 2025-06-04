import Taller from '../model/taller.js';

export class TallerController {

    static async getAllTallers(req, res) {
        try {
            const tallers = await Taller.getAll();
            return res.json({
                success: true,
                data: tallers
            });
        } catch (error) {
            console.error('Error al obtener los talleres', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener los talleres',
                message: error.message // Incluye el mensaje de error para más detalle
            });
        }
    }

    static async getTallerData(req, res) {
        try {
            const tallers = await Taller.getAll(); // Renombrado para consistencia
            return res.json({
                success: true,
                data: tallers
            });
        } catch (error) {
            console.error('Error al obtener los talleres para data', error);
            throw error;
        }
    }
    static async getTallerById(req, res) {
        try {
            const taller = await Taller.getById(req.params.id);
            return res.json({
                success: true,
                data: taller
            });
        } catch (error) {
            console.error('Error al obtener el taller por ID', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener el taller',
                message: error.message // Incluye el mensaje de error para más detalle
            });
        }
    }

    static async createTaller(req, res) {
        try {
            const newTaller = await Taller.create(req.body);
            return res.json({
                success: true,
                data: newTaller
            });
        } catch (error) {
            console.error('Error al crear el taller', error);
            return res.status(500).json({
                success: false,
                error: 'Error al crear el taller',
                message: error.message // Incluye el mensaje de error para más detalle
            });
        }
    }

    static async updateTaller(req, res) {
        try {
            const updatedTaller = await Taller.update(req.params.id, req.body);
            return res.json({
                success: true,
                message: 'Taller actualizado correctamente',
                data: updatedTaller
            });
        } catch (error) {
            console.error('Error al actualizar el taller', error);
            return res.status(500).json({
                success: false,
                error: 'Error al actualizar el taller',
                message: error.message // Incluye el mensaje de error para más detalle
            });
        }
    }

    static async deleteTaller(req, res) {
        const { id } = req.params;
        try {
            const deletedTaller = await Taller.delete(id);
            return res.json({
                success: true,
                message: 'Taller eliminado correctamente',
                data: deletedTaller
            });
        } catch (error) {
            console.error('Error al eliminar el taller', error);
            return res.status(500).json({
                success: false,
                error: 'Error al eliminar el taller',
                message: error.message // Incluye el mensaje de error para más detalle
            });
        }
    }
}