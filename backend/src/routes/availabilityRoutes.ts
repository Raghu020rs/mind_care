import express from 'express';
import { updateAvailability, getAvailability } from '../controllers/availabilityController';

const router = express.Router();

router.get('/:professionalId', getAvailability);
router.put('/:professionalId', updateAvailability);

export default router;