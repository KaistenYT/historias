import Participation from "../model/participation";

export class ParticipationController {
    static async getAllParticipation(req, res) {
        try {
            const participation = await Participation.getAll();
            return res.json({
                success: true,
                data: participation
            });
        } catch (error) {
            console.error('Error al obtener las participaciones', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener las participaciones',
                message: error.message
            });
        }
    }

    static async getParticipationById(req, res) {
        try {
            const participation = await Participation.getById(req.params.id);
            if (!participation) {
                return res.status(404).json({
                    success: false,
                    error: 'Participacion no encontrada'
                });
            }
            return res.json({
                success: true,
                data: participation
            });
        } catch (error) {
            console.error('Error al obtener la participacion', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener la participacion',
                message: error.message
            });
        }
    }

    static async createParticipation(req, res) {
        try {
            const participation = await Participation.create(req.body);
            return res.json({
                success: true,
                data: participation
            });
        } catch (error) {
            console.error('Error al crear la participacion', error);
            return res.status(500).json({
                success: false,
                error: 'Error al crear la participacion',
                message: error.message
            });
        }
    }

    static async updateParticipation(req, res) {
        try {
            const participation = await Participation.update(req.params.id, req.body);
            if (!participation) {
                return res.status(404).json({
                    success: false,
                    error: 'Participacion no encontrada'
                });
            }
            return res.json({
                success: true,
                message: 'Participacion actualizada correctamente',
                data: participation
            });
        } catch (error) {
            console.error('Error al actualizar la participacion', error);
            return res.status(500).json({
                success: false,
                error: 'Error al actualizar la participacion',
                message: error.message
            });
        }
    }

    static async deleteParticipation(req, res) {
        try {
            const participation = await Participation.delete(req.params.id);
            if (!participation) {
                return res.status(404).json({
                    success: false,
                    error: 'Participacion no encontrada'
                });
            }
            return res.json({
                success: true,
                message: 'Participacion eliminada correctamente',
                data: participation
            });
        } catch (error) {
            console.error('Error al eliminar la participacion', error);
            return res.status(500).json({
                success: false,
                error: 'Error al eliminar la participacion',
                message: error.message
            });
        }
    }

    static async getParticipationHistory(req, res) {
        try {
            const participation = await Participation.getHistoryById(req.params.id);
            if (!participation) {
                return res.status(404).json({
                    success: false,
                    error: 'Participacion no encontrada'
                });
            }
            return res.json({
                success: true,
                data: participation
            });
        } catch (error) {
            console.error('Error al obtener la participacion', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener la participacion',
                message: error.message
            });
        }
    }
}