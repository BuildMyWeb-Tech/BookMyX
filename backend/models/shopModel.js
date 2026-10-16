// backend/models/shopModel.js
import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    // BookmyX: category determines which vertical this vendor belongs to
    category: {
      type: String,
      enum: ['salon', 'turf', 'doctor_clinic'],
      required: true,
      default: 'salon',
    },

    shopId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    shopName: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    logo: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    businessName: { type: String, default: '' },
    gstNumber: { type: String, default: '' },

    // Payment / subscription
    setupAmount: { type: Number, default: 0 },
    subscriptionAmount: { type: Number, default: 0 },
    billingCycle: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      default: 'monthly',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending',
    },

    // UPI Payment Integration (customer-facing, per-salon)
    paymentIntegrationEnabled: { type: Boolean, default: false },
    upiName: { type: String, default: '' },
    upiMobileNumber: { type: String, default: '' },
    upiId: { type: String, default: '' },
    bankName: { type: String, default: '' },
    upiQrCode: { type: String, default: '' },

    // POS / Billing feature toggles
    serviceBillingEnabled: { type: Boolean, default: false },
    productBillingEnabled: { type: Boolean, default: false },
    billingTaxPercent: { type: Number, default: 0 },
    billingTaxName: { type: String, default: 'Tax' },

    // Discount / Coupon & Package feature toggles
    couponEnabled: { type: Boolean, default: false },
    packageEnabled: { type: Boolean, default: false },

    // Stylist Panel toggle
    stylistPanelEnabled: { type: Boolean, default: false },

    // WhatsApp Broadcast toggle
    broadcastEnabled: { type: Boolean, default: false },

    // Walk-in / Offline Booking toggle
    offlineBookingEnabled: { type: Boolean, default: false },

    // Turf-specific fields
    turfFacilities: [{ type: String }],   // e.g. ['floodlights','parking','changing room']
    turfSurface: { type: String, default: '' }, // 'natural grass','artificial turf','concrete'
    turfSize: { type: String, default: '' },    // e.g. '5-a-side','7-a-side','full'
    turfSports: [{ type: String }],             // ['football','cricket','badminton']
    turfPricePerSlot: { type: Number, default: 0 },
    turfSlotDuration: { type: Number, default: 60 }, // minutes

    // Doctor/Clinic/Hospital-specific fields
    clinicType: {
      type: String,
      enum: ['clinic', 'hospital', 'diagnostic', ''],
      default: '',
    },
    specializations: [{ type: String }],
    registrationNumber: { type: String, default: '' },
    emergencyContact: { type: String, default: '' },

    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
  },
  { timestamps: true }
);


shopSchema.index({ status: 1 });
shopSchema.index({ status: 1, createdAt: -1 });

const shopModel = mongoose.models.shop || mongoose.model('shop', shopSchema);
export default shopModel;
