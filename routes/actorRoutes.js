import express from 'express';
import { ActorController } from '../controller/actorController.js';

const router = express.Router();

// Rutas para actores
router.get('/list', ActorController.getAllActors); // Lista todos los actores
router.get('/:id', ActorController.getActorById); // Obtiene un actor por ID
router.post('/add', ActorController.createActor); // Crea un nuevo actor
router.put('/update/:id', ActorController.updateActor); // Actualiza un actor por su ID
router.delete('/delete/:id', ActorController.deleteActor); // Elimina un actor por su ID

export default router;
