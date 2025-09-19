import mongoose, { Schema, Document } from 'mongoose';
export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  professionalId: mongoose.Types.ObjectId;
  date: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
const BookingSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User ', required: true },
    professionalId: { type: Schema.Types.ObjectId, ref: 'User ', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);
export default mongoose.model<IBooking>('Booking', BookingSchema);