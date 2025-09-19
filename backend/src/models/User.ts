import mongoose, { Schema, Document } from 'mongoose';
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'professional';
  specialization?: string; // for professionals
  availability?: string[]; // for professionals, e.g., ['Monday 9-12', 'Wednesday 14-18']
  createdAt: Date;
  updatedAt: Date;
}
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'professional'], required: true },
    specialization: { type: String },
    availability: [{ type: String }],
  },
  { timestamps: true }
);
export default mongoose.model<IUser>('User ', UserSchema);