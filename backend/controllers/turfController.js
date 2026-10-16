// backend/controllers/turfController.js
import turfSlotModel from '../models/turfSlotModel.js';
import turfBookingModel from '../models/turfBookingModel.js';
import shopModel from '../models/shopModel.js';
import userModel from '../models/userModel.js';

// ── Admin: generate slots for a date range ───────────────────────────────────
export const generateSlots = async (req, res) => {
  try {
    const { shopId } = req.salonAdmin;
    const { dates, startHour = 6, endHour = 22, durationMinutes = 60, price } = req.body;

    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return res.json({ success: false, message: 'dates array required' });
    }

    const shop = await shopModel.findOne({ shopId });
    const slotPrice = price ?? shop?.turfPricePerSlot ?? 0;
    const duration = durationMinutes ?? shop?.turfSlotDuration ?? 60;

    const slots = [];
    for (const date of dates) {
      let hour = startHour;
      while (hour < endHour) {
        const start = `${String(hour).padStart(2, '0')}:00`;
        const end = `${String(hour + duration / 60).padStart(2, '0')}:00`;
        slots.push({ shopId, date, startTime: start, endTime: end, durationMinutes: duration, price: slotPrice });
        hour += duration / 60;
      }
    }

    // insertMany with ordered:false so duplicates (existing slots) are skipped
    const result = await turfSlotModel.insertMany(slots, { ordered: false }).catch(e => ({ insertedCount: e.result?.insertedCount ?? 0 }));
    res.json({ success: true, message: `Slots generated`, count: result.insertedCount ?? slots.length });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// ── Admin: get slots for a date ───────────────────────────────────────────────
export const getSlotsForDate = async (req, res) => {
  try {
    const { shopId } = req.salonAdmin;
    const { date } = req.query;
    const slots = await turfSlotModel.find({ shopId, date }).sort({ startTime: 1 });
    res.json({ success: true, slots });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ── Admin: block/unblock a slot ───────────────────────────────────────────────
export const toggleBlockSlot = async (req, res) => {
  try {
    const { shopId } = req.salonAdmin;
    const { slotId, isBlocked, reason } = req.body;
    const slot = await turfSlotModel.findOne({ _id: slotId, shopId });
    if (!slot) return res.json({ success: false, message: 'Slot not found' });
    slot.isBlocked = isBlocked;
    slot.blockedReason = reason || '';
    await slot.save();
    res.json({ success: true, message: isBlocked ? 'Slot blocked' : 'Slot unblocked' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ── Admin: get all turf bookings ──────────────────────────────────────────────
export const getTurfBookings = async (req, res) => {
  try {
    const { shopId } = req.salonAdmin;
    const { date, status } = req.query;
    const filter = { shopId };
    if (date) filter.date = date;
    if (status) filter.status = status;
    const bookings = await turfBookingModel.find(filter)
      .populate('userId', 'name phone email')
      .sort({ date: -1, startTime: 1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ── Admin: update booking status ──────────────────────────────────────────────
export const updateBookingStatus = async (req, res) => {
  try {
    const { shopId } = req.salonAdmin;
    const { bookingId, status, cancelReason } = req.body;
    const booking = await turfBookingModel.findOne({ _id: bookingId, shopId });
    if (!booking) return res.json({ success: false, message: 'Booking not found' });

    booking.status = status;
    if (cancelReason) booking.cancelReason = cancelReason;
    if (status === 'cancelled') {
      // free the slot
      await turfSlotModel.findByIdAndUpdate(booking.slotId, { bookedBy: null, bookingId: null });
    }
    await booking.save();
    res.json({ success: true, message: 'Status updated' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ── Admin: update payment status ──────────────────────────────────────────────
export const updatePaymentStatus = async (req, res) => {
  try {
    const { shopId } = req.salonAdmin;
    const { bookingId, paymentStatus, utrNumber } = req.body;
    const booking = await turfBookingModel.findOne({ _id: bookingId, shopId });
    if (!booking) return res.json({ success: false, message: 'Booking not found' });
    booking.paymentStatus = paymentStatus;
    if (utrNumber) booking.utrNumber = utrNumber;
    await booking.save();
    res.json({ success: true, message: 'Payment updated' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ── Public: get available slots for a date ────────────────────────────────────
export const getPublicSlots = async (req, res) => {
  try {
    const { shopId, date } = req.query;
    const slots = await turfSlotModel.find({
      shopId,
      date,
      isBlocked: false,
      bookedBy: null,
    }).sort({ startTime: 1 });
    res.json({ success: true, slots });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ── Public (authenticated user): book a slot ──────────────────────────────────
export const bookSlot = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const { shopId, slotId, sport, teamName, playerCount, paymentMethod } = req.body;

    const slot = await turfSlotModel.findOne({ _id: slotId, shopId, isBlocked: false, bookedBy: null });
    if (!slot) return res.json({ success: false, message: 'Slot not available' });

    const booking = await turfBookingModel.create({
      shopId,
      userId,
      slotId: slot._id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      sport,
      teamName,
      playerCount,
      amount: slot.price,
      paymentMethod: paymentMethod || 'offline',
    });

    slot.bookedBy = userId;
    slot.bookingId = booking._id;
    await slot.save();

    res.json({ success: true, message: 'Slot booked successfully', booking });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ── Public (authenticated user): cancel booking ───────────────────────────────
export const cancelBooking = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const { bookingId, reason } = req.body;

    const booking = await turfBookingModel.findOne({ _id: bookingId, userId });
    if (!booking) return res.json({ success: false, message: 'Booking not found' });
    if (booking.status === 'cancelled') return res.json({ success: false, message: 'Already cancelled' });

    booking.status = 'cancelled';
    booking.cancelReason = reason || 'Cancelled by customer';
    await booking.save();

    await turfSlotModel.findByIdAndUpdate(booking.slotId, { bookedBy: null, bookingId: null });

    res.json({ success: true, message: 'Booking cancelled' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ── Public (authenticated user): get my turf bookings ────────────────────────
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const { shopId } = req.query;
    const filter = { userId };
    if (shopId) filter.shopId = shopId;
    const bookings = await turfBookingModel.find(filter).sort({ date: -1, startTime: 1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
