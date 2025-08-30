import express from 'express';
import { AuthorController } from '../controller/authorController.js';
import multer from 'multer';

const router = express.Router();

// Configuración de multer
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB (en bytes)
    },
  });

// Define las rutas para los recursos de autor
router.get('/list', AuthorController.getAllAuthors);       // Obtiene todos los autores
router.get('/:id', AuthorController.getAuthorById);         // Obtiene un autor por su ID
router.post('/add', AuthorController.registerAuthor);         // Crea un nuevo autor
router.put('/update/:id', AuthorController.updateAuthor); // Actualiza un autor por su ID
router.delete('/delete/:id', AuthorController.deleteAuthor); // Elimina un autor por su ID
router.post('/upload-image/:authorId/image', upload.single('file'), AuthorController.uploadAuthorImage); // Sube la imagen del autor (APLICANDO el middleware)
router.delete('/delete-image/:authorId/image', AuthorController.deleteAuthorImage); // Elimina la imagen del autor

export default router;



