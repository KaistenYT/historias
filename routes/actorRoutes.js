import express from 'express';
import { ActorController } from '../controller/actorController.js';

const router = express.Router();

// Define las rutas para los recursos de actor
router.get('/', ActorController.getAllActors);       // Obtiene todos los actores
router.get('/:id', ActorController.getActorById);         // Obtiene un actor por su ID
router.post('/', ActorController.createActor);         // Crea un nuevo actor
router.put('/:id', ActorController.updateActor); // Actualiza un actor por su ID
router.delete('/:id', ActorController.deleteActor); // Elimina un actor por su ID


export default router;
