import express from 'express';
import {HistoryController} from '../controller/historyController.js';
import multer from 'multer';

const router = express.Router();

// Configuración de multer
const storage = multer.memoryStorage();


router.get('/list', HistoryController.getAllHistory)
router.get('/:id', HistoryController.getHistoryById)
router.post('/add', HistoryController.createHistory)
router.put('/update/:id', HistoryController.updateHistory)
router.delete('/delete/:id', HistoryController.deleteHistory)


//mis changes
router.post('/upload-image/:historyId/image', upload.single('file'), HistoryController.uploadHistoryImage); // Sube la imagen de la historia (APLICANDO el middleware)
router.delete('/delete-image/:historyId/image', HistoryController.deleteHistoryImage); // Elimina la imagen de la historia


export default router;




