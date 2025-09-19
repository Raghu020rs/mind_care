import express from 'express';
import {
  createBooking,
  getUserbookings,
  getProfessionalBookings,
  updateBookingStatus,
} from '../controllers/bookingController';

const router = express.Router();

router.post('/', createBooking);
router.get('/user/:userId', getUserbookings);
router.get('/professional/:professionalId', getProfessionalBookings);
router.patch('/:bookingId/status', updateBookingStatus);

export default router;