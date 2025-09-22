import { Request, Response } from 'express';
import Booking from '../models/Booking';
import User from '../models/User';
import { sendBookingEmail } from '../utils/emailService';

// Create a booking
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { userId, professionalId, date } = req.body;

    // Validate required fields
    if (!userId || !professionalId || !date) {
      return res.status(400).json({ message: 'User ID, Professional ID, and Date are required' });
    }

    const newBooking = new Booking({
      userId,
      professionalId,
      date,
      status: 'pending',
    });

    await newBooking.save();

    // Get user and professional details for emails
    const user = await User.findById(userId);
    const professional = await User.findById(professionalId);

    // Send email to user (if details exist)
    if (user && professional) {
      await sendBookingEmail(
        user.email,
        'Booking Confirmation - Mental Health App',
        `
          <h2>Booking Confirmed!</h2>
          <p>Dear ${user.name},</p>
          <p>Your booking with <strong>${professional.name}</strong> (${professional.specialization}) has been created successfully.</p>
          <p><strong>Date & Time:</strong> ${new Date(date).toLocaleString()}</p>
          <p><strong>Status:</strong> Pending (awaiting professional confirmation)</p>
          <p>We'll notify you once it's confirmed. If you need to cancel, contact us at ${process.env.ADMIN_EMAIL}.</p>
          <p>Take care,<br>Mental Health App Team</p>
        `
      );

      // Send email to admin (if ADMIN_EMAIL is set)
      if (process.env.ADMIN_EMAIL) {
        await sendBookingEmail(
          process.env.ADMIN_EMAIL,
          'New Booking Created - Mental Health App',
          `
            <h2>New Booking Alert!</h2>
            <p>A new booking has been created:</极p>
            <ul>
              <li><strong>User:</strong> ${user.name} (${user.email})</li>
              <li><strong>Professional:</strong> ${professional.name}</li>
              <li><strong>Date:</strong> ${new Date(date).toLocaleString()}</li>
              <li><strong>Booking ID:</strong> ${newBooking._id}</li>
            </ul>
            <p>Please review and confirm the appointment.</p>
          `
        );
      }
    } else {
      console.log('Could not fetch user/professional details for email');
    }

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error creating booking', error: (error as Error).message });
  }
};

// Get bookings for a user
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId })
      .populate('professionalId', 'name specialization email')
      .sort({ date: 1 });
    res.json(bookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error fetching bookings', error: (error as Error).message });
  }
};

// Get bookings for a professional
export const getProfessionalBookings = async (req: Request, res: Response) => {
  try {
    const { professionalId } = req.params;
    const bookings = await Booking.find({ professionalId })
      .populate('userId', 'name email phone')
      .sort({ date: 1 });
    res.json(bookings);
  } catch (error) {
    console.error('Get professional bookings error:', error);
    res.status(500).json({ message: 'Server error fetching bookings', error: (error as Error).message });
  }
};

// Update booking status
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be: pending, confirmed, cancelled, or completed' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const oldStatus = booking.status;
    booking.status = status;
    await booking.save();

    // Send email notification for status update (if status changed)
    if (oldStatus !== status) {
      const populatedBooking = await Booking.findById(bookingId)
        .populate<{userId: {name: string; email: string}}>('userId', 'name email')
        .populate<{professionalId: {name: string}}>('professionalId', 'name');

      if (populatedBooking?.userId && populatedBooking?.professionalId) {
        await sendBookingEmail(
          populatedBooking.userId.email,
          'Booking Status Updated - Mental Health App',
          `
            <h2>Booking Update</h2>
            <p>Dear ${populatedBooking.userId.name},</p>
            <p>Your booking with <strong>${populatedBooking.professionalId.name}</strong> has been updated.</p>
            <p><strong>New Status:</strong> ${status.toUpperCase()}</p>
            <p><strong>Date:</strong> ${new Date(booking.date).toLocaleString()}</p>
            ${
              status === 'confirmed' 
                ? '<p>You极r appointment is confirmed! We look forward to supporting you.</p>'
                : status === 'cancelled'
                ? '<p>Your appointment has been cancelled. If you need to reschedule, please book a new slot.</p>'
                : '<p>Thank you for completing your session. Feel free to book again anytime.</p>'
            }
            <p>Take care,<br>Mental Health App Team</p>
          `
        );
      }
    }

    res.json(booking);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error updating booking', error: (error as Error).message });
  }
};

// Additional: Get all bookings (admin only)
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('professionalId', 'name specialization')
      .sort({ date: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error fetching all bookings', error: (error as Error).message });
  }
};