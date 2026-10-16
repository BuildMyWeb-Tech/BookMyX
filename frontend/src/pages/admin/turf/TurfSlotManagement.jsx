import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SalonAdminContext } from '../../../context/SalonAdminContext';
import {
  Calendar, Clock, Plus, Lock, Unlock, RefreshCw,
  ChevronLeft, ChevronRight, Zap, CheckCircle, XCircle,
  LayoutGrid, TrendingUp, AlertCircle, X, Layers,
} from 'lucide-react';

const today = () => new Date().toISOString().slice(0, 10);
const addDays = (d, n) => {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};
const fmtDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

export default function TurfSlotManagement() {
  const { backendUrl, saAdminToken, shopInfo } = useContext(SalonAdminContext);
  const shopId = shopInfo?.shopId;

  const [date, setDate] = useState(today());
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genModal, setGenModal] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [genForm, setGenForm] = useState({
    startDate: today(),
    endDate: today(),
    startHour: 6,
    endHour: 22,
    durationMinutes: shopInfo?.turfSlotDuration || 60,
    price: shopInfo?.turfPricePerSlot || 0,
  });

  const loadSlots = async () => {
    if (!shopId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/turf/admin/slots`, {
        params: { date },
        headers: { satoken: saAdminToken },
      });
      if (data.success) setSlots(data.slots);
    } catch {
      toast.error('Failed to load slots');
    }
    setLoading(false);
  };

  useEffect(() => { loadSlots(); }, [date, shopId]);

  const toggleBlock = async (slotId, isBlocked) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/turf/admin/block-slot`,
        { slotId, isBlocked: !isBlocked },
        { headers: { satoken: saAdminToken } }
      );
      if (data.success) { toast.success(data.message); loadSlots(); }
      else toast.error(data.message);
    } catch { toast.error('Failed to update slot'); }
  };

  const generateSlots = async () => {
    const dates = [];
    let cur = genForm.startDate;
    while (cur <= genForm.endDate) { dates.push(cur); cur = addDays(cur, 1); }
    if (!dates.length) { toast.error('Invalid date range'); return; }
    setGenLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/turf/admin/generate-slots`,
        { ...genForm, dates },
        { headers: { satoken: saAdminToken } }
      );
      if (data.success) {
        toast.success(`${data.count} slots created`);
        setGenModal(false);
        loadSlots();
      } else toast.error(data.message);
    } catch { toast.error('Failed to generate slots'); }
    setGenLoading(false);
  };

  // Slot stats
  const stats = {
    total: slots.length,
    available: slots.filter(s => !s.isBlocked && !s.bookedBy).length,
    booked: slots.filter(s => s.bookedBy).length,
    blocked: slots.filter(s => s.isBlocked).length,
  };

  const slotStatus = (slot) => {
    if (slot.bookedBy) return 'booked';
    if (slot.isBlocked) return 'blocked';
    return 'available';
  };

  const statusConfig = {
    available: {
      card: 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-md',
      badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      icon: <CheckCircle size={12} className="text-emerald-500" />,
      label: 'Available',
    },
    booked: {
      card: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200',
      badge: 'bg-teal-50 text-teal-700 border border-teal-200',
      icon: <CheckCircle size={12} className="text-teal-600" />,
      label: 'Booked',
    },
    blocked: {
      card: 'bg-red-50/60 border-red-200',
      badge: 'bg-red-50 text-red-700 border border-red-200',
      icon: <XCircle size={12} className="text-red-500" />,
      label: 'Blocked',
    },
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Slot Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">View, block and generate time slots for your turf</p>
        </div>
        <button
          onClick={() => setGenModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-emerald-200 transition-all"
        >
          <Plus size={16} /> Generate Slots
        </button>
      </div>

      {/* Stats row */}
      {slots.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Slots', value: stats.total, icon: <LayoutGrid size={16} />, color: 'text-gray-600 bg-gray-100' },
            { label: 'Available', value: stats.available, icon: <CheckCircle size={16} />, color: 'text-emerald-600 bg-emerald-100' },
            { label: 'Booked', value: stats.booked, icon: <TrendingUp size={16} />, color: 'text-teal-600 bg-teal-100' },
            { label: 'Blocked', value: stats.blocked, icon: <AlertCircle size={16} />, color: 'text-red-500 bg-red-100' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <span className={`p-2 rounded-xl ${s.color}`}>{s.icon}</span>
              <div>
                <p className="text-xl font-bold text-gray-800">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Date navigator */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDate(addDays(date, -1))}
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
            <span className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
              <Calendar size={14} className="text-emerald-500" />
              {fmtDate(date)}
            </span>
          </div>
          <button
            onClick={() => setDate(addDays(date, 1))}
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={loadSlots}
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-emerald-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Slots grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading slots…</p>
        </div>
      ) : slots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
            <Layers size={28} className="text-emerald-400" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">No slots for {date}</h3>
          <p className="text-sm text-gray-400 mb-5">Generate slots to make this date available for booking</p>
          <button
            onClick={() => setGenModal(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <Zap size={15} /> Generate Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {slots.map(slot => {
            const st = slotStatus(slot);
            const cfg = statusConfig[st];
            return (
              <div
                key={slot._id}
                className={`rounded-2xl border p-4 flex flex-col gap-3 transition-all ${cfg.card}`}
              >
                {/* Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-800">
                    <Clock size={14} className="text-emerald-500 shrink-0" />
                    <span className="font-bold text-sm">{slot.startTime}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${cfg.badge}`}>
                    {cfg.icon} {cfg.label}
                  </span>
                </div>

                <div className="text-xs text-gray-500 -mt-2">to {slot.endTime}</div>

                {/* Price */}
                <div className="font-bold text-emerald-700 text-lg leading-none">₹{slot.price}</div>

                {/* Action */}
                {!slot.bookedBy && (
                  <button
                    onClick={() => toggleBlock(slot._id, slot.isBlocked)}
                    className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      slot.isBlocked
                        ? 'bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        : 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    {slot.isBlocked
                      ? <><Unlock size={12} /> Unblock</>
                      : <><Lock size={12} /> Block</>
                    }
                  </button>
                )}
                {slot.bookedBy && (
                  <div className="text-xs text-teal-600 font-medium text-center py-1.5 bg-teal-50 rounded-xl border border-teal-100">
                    Slot Reserved
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Generate Modal */}
      {genModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Generate Turf Slots</h3>
                  <p className="text-emerald-100 text-sm mt-0.5">Create time slots for a date range</p>
                </div>
                <button onClick={() => setGenModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Start Date', 'startDate', 'date'],
                  ['End Date', 'endDate', 'date'],
                  ['Start Hour (0–23)', 'startHour', 'number'],
                  ['End Hour (0–23)', 'endHour', 'number'],
                  ['Duration (minutes)', 'durationMinutes', 'number'],
                  ['Price per slot (₹)', 'price', 'number'],
                ].map(([label, key, type]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
                    <input
                      type={type}
                      value={genForm[key]}
                      onChange={e => setGenForm(f => ({ ...f, [key]: type === 'number' ? parseInt(e.target.value) || 0 : e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Preview */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-700">
                <Zap size={12} className="inline mr-1" />
                Generates ~{Math.floor((genForm.endHour - genForm.startHour) * 60 / (genForm.durationMinutes || 60))} slots/day at ₹{genForm.price}/slot
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setGenModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={generateSlots}
                  disabled={genLoading}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {genLoading
                    ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating…</>
                    : <><Zap size={15} /> Generate</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
