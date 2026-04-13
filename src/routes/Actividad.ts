import express from 'express';
import controller from '../controllers/Actividad';

const router = express.Router();

router.get('/', controller.readAll);

export default router;