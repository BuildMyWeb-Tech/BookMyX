// backend/models/turfBookingModel.js
import mongoose from 'mongoose';

const turfBookingSchema = new mongoose.Schema(
  {
    shopId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'turfslot', required: true },
    date: { type: String, required: true },        // 'YYYY-MM-DD'
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    sport: { type: String, default: '' },
    teamName: { type: String, default: '' },
    playerCount: { type: Number, default: 0 },
    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['online', 'offline', 'cash'],
      default: 'offline',
    },
    utrNumber: { type: String, default: '' },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed', 'no_show'],
      default: 'confirmed',
    },
    cancelReason: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

turfBookingSchema.index({ shopId: 1, date: 1 });
turfBookingSchema.index({ userId: 1 });

const turfBookingModel =
  mongoose.models.turfbooking || mongoose.model('turfbooking', turfBookingSchema);
export default turfBookingModel;
