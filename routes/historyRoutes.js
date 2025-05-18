import express from 'express';
import {HistoryController} from '../controller/historyController.js';
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

const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB (en bytes)
    },
  });

router.get('/list', HistoryController.getAllHistory)
router.get('/:id', HistoryController.getHistoryById)
router.post('/add', HistoryController.createHistory)
router.put('/update/:id', HistoryController.updateHistory)
router.delete('/delete/:id', HistoryController.deleteHistory)


router.post('/upload-image/:historyId/image', upload.single('file'), HistoryController.uploadHistoryImage); // Sube la imagen de la historia (APLICANDO el middleware)
router.delete('/delete-image/:historyId/image', HistoryController.deleteHistoryImage); // Elimina la imagen de la historia


export default router;
