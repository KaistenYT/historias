import express from 'express';
import { TallerController } from '../controller/tallerController.js';


const router = express.Router();

router.get('/list', TallerController.getAllTallers);
router.get('/:id', TallerController.getTallerById);
router.post('/add', TallerController.createTaller);
router.put('/update/:id', TallerController.updateTaller);
router.delete('/delete/:id', TallerController.deleteTaller);

export default router;
