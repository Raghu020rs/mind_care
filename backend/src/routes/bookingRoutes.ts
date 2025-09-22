import express from 'express';
import {
  createBooking,
  getUserBookings,
  getProfessionalBookings,
  updateBookingStatus,
  getAllBookings
} from '../controllers/bookingController';

const router = express.Router();

router.post('/', createBooking);
router.get('/user/:userId', getUserBookings);
router.get('/professional/:professionalId', getProfessionalBookings);
router.patch('/:bookingId/status', updateBookingStatus);
router.get('/', getAllBookings); // For admin

export default router;