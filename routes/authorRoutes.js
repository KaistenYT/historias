import express from 'express';
import { AuthorController } from '../controller/authorController.js';

const router = express.Router();

// Define las rutas para los recursos de autor
router.get('/list', AuthorController.getAllAuthors);       // Obtiene todos los autores
router.get('/:id', AuthorController.getAuthorById);         // Obtiene un autor por su ID
router.post('/add', AuthorController.registerAuthor);         // Crea un nuevo autor
router.put('/update/:id', AuthorController.updateAuthor); // Actualiza un autor por su ID
router.delete('/delete/:id', AuthorController.deleteAuthor); // Elimina un autor por su ID

export default router;
