import Actor from '../model/actor.js';

import fs from 'fs/promises';


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

  static async uploadActorImage(req, res) {
    const { actorId } = req.params;

    // Verificar si se envió un archivo
    if (!req.file) {
        return res.status(400).json({ message: 'Por favor, sube una imagen' });
    }

    try {
        // Leer el contenido del archivo desde la ruta guardada por multer (diskStorage)
        const imageBuffer = await fs.readFile(req.file.path);

        // Llama a la función uploadImage de tu modelo Actor, pasando el buffer
        const updatedActor = await Actor.uploadImage(actorId, imageBuffer);

        res.status(200).json(updatedActor); // Envía la respuesta con el actor actualizado (incluyendo la URL de la imagen)
    } catch (error) {
        console.error('Error al subir la imagen del actor en el controlador:', error);
        res.status(500).json({ message: 'Error al subir la imagen del actor', error: error.message });
    } finally {
        // Opcional: Eliminar el archivo temporal del servidor después de subirlo a Supabase
        if (req.file && req.file.path) {
            try {
                await fs.unlink(req.file.path);
                console.log('Archivo temporal eliminado:', req.file.path);
            } catch (unlinkError) {
                console.error('Error al eliminar el archivo temporal:', unlinkError);
            }
        }
      }
    }

  static async deleteActorImage(req, res) {
    const { actorId } = req.params;
    try {
      const result = await Actor.deleteImage(actorId);
      res.status(200).json({ message: 'Imagen del actor eliminada exitosamente', data: result });
    } catch (error) {
      console.error('Error al eliminar la imagen del actor en el controlador:', error);
      res.status(500).json({ message: 'Error al eliminar la imagen del actor', error: error.message });
    }
  }
 
}
