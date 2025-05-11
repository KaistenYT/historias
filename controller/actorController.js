import Actor from '../model/actor.js';

export class ActorController {

  static async getAllActors(req, res) {
    try {
      const actors = await Actor.getAll();
      return res.json({
        success: true,
        data: actors
      });
    } catch (error) {
      console.error('Error al obtener los actores', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener los actores',
        message: error.message // Incluye el mensaje de error para más detalle
      });
    }
  }


  static async getActorData() {
    try {
      const actors = await Actor.getAll(); // Renombrado para consistencia
      return actors;
    } catch (error) {
      console.error('Error al obtener los actores para data', error);
      return []; // Mantén el comportamiento de devolver un array vacío en caso de error
    }
  }


  static async getActorById(req, res) {
    try {
      const actor = await Actor.getById(req.params.id);
      if (!actor) {
        return res.status(404).json({
          success: false,
          error: 'Actor no encontrado'
        });
      }
      return res.json({
        success: true,
        data: actor
      });
    } catch (error) {
      console.error('Error al obtener el actor por ID', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener el actor',
        message: error.message
      });
    }
  }


  static async createActor(req, res) {
    try {
      const newActor = await Actor.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Actor registrado correctamente',
        data: newActor
      });
    } catch (error) {
      console.error('Error al registrar el actor', error);
      return res.status(500).json({
        success: false,
        message: 'Error al registrar actor',
        error: error.message // Incluye el mensaje de error
      });
    }
  }

  static async updateActor(req, res) {
    try {
      const updatedActor = await Actor.update(req.params.id, req.body); // Cambiado a updatedActor
      if (!updatedActor) { // Verificamos si updatedActor es null o undefined
        return res.status(404).json({
          success: false,
          error: 'Actor no encontrado'
        });
      }
      return res.json({
        success: true,
        message: 'Actor actualizado correctamente',
        data: updatedActor // Devolvemos los datos actualizados
      });
    } catch (error) {
      console.error('Error al actualizar el actor', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar actor',
        error: error.message
      });
    }
  }


  static async deleteActor(req, res) {
    try {
      const deletedActor = await Actor.delete(req.params.id); // Cambiado a deletedActor
      if (!deletedActor) { // Verificamos si deletedActor es null o undefined
        return res.status(404).json({
          success: false,
          error: 'Actor no encontrado'
        });
      }
      return res.json({
        success: true,
        message: 'Actor eliminado correctamente',
        data: deletedActor  // Devolvemos los datos eliminados
      });
    } catch (error) {
      console.error('Error al eliminar el actor', error);
      return res.status(500).json({
        success: false,
        error: 'Error al eliminar el actor',
        message: error.message
      });
    }
  }
}
