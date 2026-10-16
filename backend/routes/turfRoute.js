// backend/routes/turfRoute.js
import express from 'express';
import authSalonAdmin from '../middleware/authSalonAdmin.js';
import authUser from '../middleware/authUser.js';
import {
  generateSlots,
  getSlotsForDate,
  toggleBlockSlot,
  getTurfBookings,
  updateBookingStatus,
  updatePaymentStatus,
  getPublicSlots,
  bookSlot,
  cancelBooking,
  getMyBookings,
} from '../controllers/turfController.js';

const turfRouter = express.Router();

// Admin routes (require salon-admin auth)
turfRouter.post('/admin/generate-slots', authSalonAdmin, generateSlots);
turfRouter.get('/admin/slots', authSalonAdmin, getSlotsForDate);
turfRouter.post('/admin/block-slot', authSalonAdmin, toggleBlockSlot);
turfRouter.get('/admin/bookings', authSalonAdmin, getTurfBookings);
turfRouter.post('/admin/update-status', authSalonAdmin, updateBookingStatus);
turfRouter.post('/admin/update-payment', authSalonAdmin, updatePaymentStatus);

// Public routes
turfRouter.get('/slots', getPublicSlots);

// Authenticated user routes
turfRouter.post('/book', authUser, bookSlot);
turfRouter.post('/cancel', authUser, cancelBooking);
turfRouter.get('/my-bookings', authUser, getMyBookings);

export default turfRouter;
