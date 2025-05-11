import express from 'express'
import {ParticipationController} from '../controller/participationController'

const router = express.Router()

router.get('/list', ParticipationController.getAllParticipation)
router.get('/:id', ParticipationController.getParticipationById)
router.post('/add', ParticipationController.createParticipation)
router.put('/update/:id', ParticipationController.updateParticipation)
router.delete('/delete/:id', ParticipationController.deleteParticipation)


export default router