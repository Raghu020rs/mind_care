import { Request, Response } from 'express';
import User from '../models/User';

export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const { professionalId } = req.params;
    const { availability } = req.body;

    const professional = await User.findById(professionalId);
    if (!professional) return res.status(404).json({ message: 'Professional not found' });

    professional.availability = availability;
    await professional.save();

    res.json({ message: 'Availability updated successfully', availability });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAvailability = async (req: Request, res: Response) => {
  try {
    const { professionalId } = req.params;
    const professional = await User.findById(professionalId).select('availability');
    
    if (!professional) return res.status(404).json({ message: 'Professional not found' });

    res.json(professional.availability || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};