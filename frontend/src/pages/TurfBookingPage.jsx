import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import { AppContext } from '../context/AppContext';
import {
  Calendar, Clock, Dumbbell, Users, CheckCircle, ChevronLeft, ChevronRight,
  MapPin, Phone, Wifi, Car, Zap, Star, Shield, Trophy, X,
  ArrowRight, Ticket, CreditCard, Banknote, AlertCircle, LayoutGrid,
} from 'lucide-react';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const today = () => new Date().toISOString().slice(0, 10);
const addDays = (d, n) => {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const facilityConfig = {
  parking: { icon: Car, label: 'Parking' },
  floodlights: { icon: Zap, label: 'Floodlights' },
  wifi: { icon: Wifi, label: 'Wi-Fi' },
  changing: { icon: Users, label: 'Changing Room' },
  washroom: { icon: Shield, label: 'Washroom' },
};

const statusBadge = {
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function TurfBookingPage() {
  const { currentShop } = useContext(ShopContext);
  const { token, userData } = useContext(AppContext);

  const [date, setDate] = useState(today());
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ sport: '', teamName: '', playerCount: '', paymentMethod: 'offline' });
  const [confirming, setConfirming] = useState(false);

  const shopId = currentShop?.shopId;

  const loadSlots = async () => {
    if (!shopId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/turf/slots`, { params: { shopId, date } });
      if (data.success) setSlots(data.slots);
    } catch { toast.error('Failed to load slots'); }
    setLoading(false);
  };

  useEffect(() => { loadSlots(); }, [date, shopId]);

  const handleBook = async () => {
    if (!token) { toast.error('Please login to book a slot'); return; }
    if (!selected) { toast.error('Please select a slot'); return; }
    setConfirming(true);
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/turf/book`, {
        shopId,
        slotId: selected._id,
        ...form,
        playerCount: parseInt(form.playerCount) || 0,
      }, { headers: { token } });
      if (data.success) {
        toast.success('Slot booked successfully!');
        setSelected(null);
        setForm({ sport: '', teamName: '', playerCount: '', paymentMethod: 'offline' });
        loadSlots();
      } else {
        toast.error(data.message);
      }
    } catch { toast.error('Booking failed'); }
    setConfirming(false);
  };

  const sports = currentShop?.turfSports || [];
  const facilities = currentShop?.turfFacilities || [];

  // Build 7-day quick-select
  const quickDays = Array.from({ length: 7 }, (_, i) => addDays(today(), i));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div className="relative bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -left-10 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute top-8 right-40 w-20 h-20 bg-white/10 rounded-full" />

        <div className="relative max-w-5xl mx-auto px-4 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {currentShop?.logo ? (
              <img
                src={currentShop.logo}
                alt=""
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/30 shadow-lg shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 shrink-0">
                <Trophy size={32} className="text-white" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-emerald-100 text-xs font-medium uppercase tracking-widest">Sports Turf</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                {currentShop?.shopName || 'Book Your Slot'}
              </h1>
              <div className="flex flex-wrap gap-4 text-emerald-100 text-sm">
                {currentShop?.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} /> {currentShop.address}, {currentShop.city}
                  </span>
                )}
                {currentShop?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={13} /> {currentShop.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sport tags */}
          {sports.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {sports.map(s => (
                <span key={s} className="bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                  <Dumbbell size={11} /> {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Facilities strip */}
        {facilities.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {facilities.map(f => {
              const key = f.toLowerCase();
              const cfg = facilityConfig[key] || { icon: Dumbbell, label: f };
              const Icon = cfg.icon;
              return (
                <div key={f} className="bg-white rounded-xl border border-gray-200 px-4 py-2.5 flex items-center gap-2 text-sm text-gray-700 shadow-sm">
                  <Icon size={15} className="text-emerald-500" /> {cfg.label || f}
                </div>
              );
            })}
          </div>
        )}

        {/* Quick date tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Calendar size={17} className="text-emerald-600" /> Select Date
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDate(addDays(date, -1))}
                disabled={date <= today()}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <input
                type="date"
                value={date}
                min={today()}
                onChange={e => setDate(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
              <button
                onClick={() => setDate(addDays(date, 1))}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* 7-day pill selector */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {quickDays.map(d => {
              const dt = new Date(d + 'T00:00:00');
              const isToday = d === today();
              const isSelected = d === date;
              return (
                <button
                  key={d}
                  onClick={() => setDate(d)}
                  className={`flex flex-col items-center min-w-[58px] py-3 px-2 rounded-2xl text-sm font-medium transition-all border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <span className={`text-xs ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
                    {isToday ? 'Today' : DAY_NAMES[dt.getDay()]}
                  </span>
                  <span className="font-bold text-base leading-tight">{dt.getDate()}</span>
                  <span className={`text-xs ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
                    {MONTH_SHORT[dt.getMonth()]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Available slots */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Clock size={17} className="text-emerald-600" /> Available Slots
            </h3>
            {!loading && slots.length > 0 && (
              <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                {slots.length} slot{slots.length !== 1 ? 's' : ''} available
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Loading slots…</p>
            </div>
          ) : slots.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                <LayoutGrid size={26} className="text-gray-300" />
              </div>
              <p className="font-semibold text-gray-600 mb-1">No slots available</p>
              <p className="text-sm text-gray-400">Try selecting a different date</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {slots.map(slot => {
                const isSelected = selected?._id === slot._id;
                return (
                  <button
                    key={slot._id}
                    onClick={() => setSelected(s => s?._id === slot._id ? null : slot)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all group relative overflow-hidden ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-600 shadow-lg shadow-emerald-200'
                        : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                    )}
                    <div className={`font-bold text-lg leading-none mb-0.5 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                      {slot.startTime}
                    </div>
                    <div className={`text-xs mb-3 ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
                      to {slot.endTime}
                    </div>
                    <div className={`font-extrabold text-xl ${isSelected ? 'text-white' : 'text-emerald-600'}`}>
                      ₹{slot.price}
                    </div>
                    {!isSelected && (
                      <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Tap to select <ArrowRight size={10} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Booking form (slides in when a slot is selected) */}
        {selected && (
          <div className="bg-white rounded-2xl border border-emerald-200 shadow-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Ticket size={18} className="text-emerald-600" />
                Complete Your Booking
              </h3>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                <X size={18} />
              </button>
            </div>

            {/* Selected slot recap */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <Clock size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{selected.startTime} – {selected.endTime}</div>
                  <div className="text-xs text-gray-500">1 slot · {currentShop?.turfSlotDuration || 60} min</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-emerald-700">₹{selected.price}</div>
                <div className="text-xs text-gray-400">per slot</div>
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Sport</label>
                <div className="relative">
                  <Dumbbell size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={form.sport}
                    onChange={e => setForm(f => ({ ...f, sport: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white transition-all"
                  >
                    <option value="">Select sport</option>
                    {sports.length > 0
                      ? sports.map(s => <option key={s}>{s}</option>)
                      : <><option>Football</option><option>Cricket</option><option>Badminton</option></>
                    }
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Team Name <span className="text-gray-300 font-normal">(optional)</span></label>
                <div className="relative">
                  <Trophy size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={form.teamName}
                    onChange={e => setForm(f => ({ ...f, teamName: e.target.value }))}
                    placeholder="e.g. FC Warriors"
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Number of Players</label>
                <div className="relative">
                  <Users size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={form.playerCount}
                    onChange={e => setForm(f => ({ ...f, playerCount: e.target.value }))}
                    placeholder="e.g. 10"
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: 'offline', label: 'Pay at Venue', icon: Banknote },
                    { val: 'online', label: 'Pay Online', icon: CreditCard },
                  ].map(({ val, label, icon: Icon }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, paymentMethod: val }))}
                      className={`flex flex-col items-center gap-1 py-2.5 px-3 rounded-xl border-2 text-xs font-medium transition-all ${
                        form.paymentMethod === val
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            {!token ? (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle size={18} className="text-amber-500 shrink-0" />
                <div className="flex-1 text-sm text-amber-800">Login required to complete booking</div>
                <a href="login" className="bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-amber-600 transition-colors">
                  Login
                </a>
              </div>
            ) : (
              <button
                onClick={handleBook}
                disabled={confirming}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {confirming
                  ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Confirming…</>
                  : <><CheckCircle size={17} /> Confirm Booking — ₹{selected.price}</>
                }
              </button>
            )}
          </div>
        )}

        {/* Footer CTA */}
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
          {token ? (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Ticket size={15} className="text-emerald-500" />
                View your booking history and manage reservations
              </div>
              <a
                href="my-appointments"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-emerald-200"
              >
                My Bookings <ArrowRight size={14} />
              </a>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Trophy size={15} className="text-emerald-500" />
                Sign in to book a slot and track your reservations
              </div>
              <a
                href="login"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-emerald-200"
              >
                Login <ArrowRight size={14} />
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
