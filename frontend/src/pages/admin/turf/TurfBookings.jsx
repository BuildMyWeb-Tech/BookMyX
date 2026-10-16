import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SalonAdminContext } from '../../../context/SalonAdminContext';
import { Calendar, Users, CreditCard, Check, X, Clock, Filter } from 'lucide-react';

const today = () => new Date().toISOString().slice(0, 10);

const STATUS_COLORS = {
  confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled: 'bg-red-50 text-red-700 border-red-100',
  no_show: 'bg-gray-50 text-gray-600 border-gray-200',
};
const PAYMENT_COLORS = {
  paid: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  refunded: 'bg-purple-50 text-purple-700',
};

export default function TurfBookings() {
  const { backendUrl, saAdminToken } = useContext(SalonAdminContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/turf/admin/bookings`, {
        params: { date, status },
        headers: { satoken: saAdminToken },
      });
      if (data.success) setBookings(data.bookings);
    } catch { toast.error('Failed to load bookings'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [date, status]);

  const updateStatus = async (bookingId, newStatus) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/turf/admin/update-status`,
        { bookingId, status: newStatus },
        { headers: { satoken: saAdminToken } }
      );
      if (data.success) { toast.success('Status updated'); load(); }
      else toast.error(data.message);
    } catch { toast.error('Failed to update'); }
  };

  const updatePayment = async (bookingId, paymentStatus) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/turf/admin/update-payment`,
        { bookingId, paymentStatus },
        { headers: { satoken: saAdminToken } }
      );
      if (data.success) { toast.success('Payment updated'); load(); }
      else toast.error(data.message);
    } catch { toast.error('Failed to update payment'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Turf Bookings</h2>
          <p className="text-sm text-gray-500">Manage all slot reservations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-sm text-gray-500"><Filter size={15} /> Filters:</div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white">
          <option value="">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no_show">No Show</option>
        </select>
        {(date || status) && (
          <button onClick={() => { setDate(''); setStatus(''); }} className="text-xs text-gray-400 hover:text-gray-600 underline">Clear</button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading…</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-14 text-gray-400">
          <Calendar size={36} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="font-semibold text-gray-800">{b.userId?.name || 'Customer'}</div>
                  <div className="text-sm text-gray-500">{b.userId?.phone} · {b.userId?.email}</div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${STATUS_COLORS[b.status]}`}>
                    {b.status}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${PAYMENT_COLORS[b.paymentStatus]}`}>
                    {b.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1.5"><Calendar size={14} className="text-emerald-500" />{b.date}</div>
                <div className="flex items-center gap-1.5"><Clock size={14} className="text-emerald-500" />{b.startTime} – {b.endTime}</div>
                <div className="flex items-center gap-1.5"><Users size={14} className="text-emerald-500" />{b.sport || 'N/A'} · {b.playerCount || 0} players</div>
                <div className="flex items-center gap-1.5"><CreditCard size={14} className="text-emerald-500" />₹{b.amount}</div>
              </div>

              <div className="flex flex-wrap gap-2">
                {b.status === 'confirmed' && (
                  <>
                    <button onClick={() => updateStatus(b._id, 'completed')}
                      className="flex items-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-medium">
                      <Check size={12} /> Mark Completed
                    </button>
                    <button onClick={() => updateStatus(b._id, 'no_show')}
                      className="flex items-center gap-1 bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-medium">
                      No Show
                    </button>
                    <button onClick={() => updateStatus(b._id, 'cancelled')}
                      className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-medium">
                      <X size={12} /> Cancel
                    </button>
                  </>
                )}
                {b.paymentStatus === 'pending' && (
                  <button onClick={() => updatePayment(b._id, 'paid')}
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-medium">
                    <CreditCard size={12} /> Mark Paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
