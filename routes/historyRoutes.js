import express from 'express';
import {HistoryController} from '../controller/historyController';

const router = express.Router();

router.get('/list', HistoryController.getAllHistory)
router.get('/:id', HistoryController.getHistoryById)
router.post('/add', HistoryController.createHistory)
router.put('/update/:id', HistoryController.updateHistory)
router.delete('/delete/:id', HistoryController.deleteHistory)



export default router;
