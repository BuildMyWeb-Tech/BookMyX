// backend/models/turfSlotModel.js
import mongoose from 'mongoose';

// Represents a single bookable time slot for a turf on a specific date
const turfSlotSchema = new mongoose.Schema(
  {
    shopId: { type: String, required: true, index: true },
    date: { type: String, required: true },       // 'YYYY-MM-DD'
    startTime: { type: String, required: true },  // 'HH:MM' 24h
    endTime: { type: String, required: true },
    durationMinutes: { type: Number, default: 60 },
    price: { type: Number, required: true },
    isBlocked: { type: Boolean, default: false },
    blockedReason: { type: String, default: '' },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'turfbooking', default: null },
  },
  { timestamps: true }
);

turfSlotSchema.index({ shopId: 1, date: 1, startTime: 1 }, { unique: true });

const turfSlotModel =
  mongoose.models.turfslot || mongoose.model('turfslot', turfSlotSchema);
export default turfSlotModel;
