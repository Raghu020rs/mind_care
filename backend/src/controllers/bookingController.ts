import { Request, Response } from 'express';
import Booking from '../models/Booking';

// Create a booking
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { userId, professionalId, date } = req.body;

    const newBooking = new Booking({
      userId,
      professionalId,
      date,
      status: 'pending',
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get bookings for a user
export const getUserbookings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).populate('professionalId', 'name specialization');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get bookings for a professional
export const getProfessionalBookings = async (req: Request, res: Response) => {
  try {
    const { professionalId } = req.params;
    const bookings = await Booking.find({ professionalId }).populate('userId', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update booking status
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};