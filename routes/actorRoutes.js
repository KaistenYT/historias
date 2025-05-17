import express from 'express';
import { ActorController } from '../controller/actorController.js';
import multer from 'multer';

const router = express.Router();

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directorio donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nombre único para la imagen
  }
}); 

const upload = multer({ storage: storage });

// Rutas para actores
router.get('/list', ActorController.getAllActors); // Lista todos los actores
router.get('/:id', ActorController.getActorById); // Obtiene un actor por ID
router.post('/add', ActorController.createActor); // Crea un nuevo actor
router.put('/update/:id', ActorController.updateActor); // Actualiza un actor por su ID
router.delete('/delete/:id', ActorController.deleteActor); // Elimina un actor por su ID
router.post('/upload-image/:actorId/image', upload.single('file'), ActorController.uploadActorImage); // Sube la imagen del actor (APLICANDO el middleware)
router.delete('/delete-image/:actorId/image', ActorController.deleteActorImage); // Elimina la imagen del actor

export default router;