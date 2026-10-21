import { useContext, useEffect, useState } from 'react';
import { SuperAdminContext } from '../../context/SuperAdminContext';
import {
  Store, Users, CheckCircle, Clock,
  ArrowUpRight, RefreshCw, Scissors,
  Dumbbell, Stethoscope, Sparkles, Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORY_CONFIG = {
  salon: { label: 'Salon', color: 'bg-blue-100 text-blue-700', icon: <Scissors size={13} /> },
  turf: { label: 'Turf', color: 'bg-emerald-100 text-emerald-700', icon: <Dumbbell size={13} /> },
  doctor_clinic: { label: 'Clinic', color: 'bg-sky-100 text-sky-700', icon: <Stethoscope size={13} /> },
};

// eslint-disable-next-line react/prop-types
const StatCard = ({ icon: Icon, label, value, sub, gradient }) => (
  <div className={`rounded-2xl p-5 text-white ${gradient} shadow-lg relative overflow-hidden`}>
    <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
    <div className="absolute bottom-0 left-1/3 w-12 h-12 bg-white/10 rounded-full" />
    <div className="relative z-10">
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
        <Icon size={20} className="text-white" />
      </div>
      <p className="text-3xl font-extrabold leading-none mb-1">{value ?? '—'}</p>
      <p className="text-white/80 text-xs font-semibold uppercase tracking-wide">{label}</p>
      {sub && <p className="text-white/60 text-[11px] mt-0.5">{sub}</p>}
    </div>
  </div>
);

const SuperAdminDashboard = () => {
  const { getDashboard, dashData, loading } = useContext(SuperAdminContext);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { getDashboard(); }, []);

  const refresh = async () => {
    setRefreshing(true);
    await getDashboard();
    setRefreshing(false);
  };

  const d = dashData;

  return (
    <div className="p-6 space-y-6">
      {/* Hero header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-700 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-white/10 rounded-full translate-y-1/2" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-violet-200" />
              <span className="text-violet-200 text-xs font-semibold uppercase tracking-widest">Super Admin</span>
            </div>
            <h1 className="text-2xl font-extrabold">Platform Overview</h1>
            <p className="text-white/60 text-sm mt-1">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all border border-white/20"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <Link
              to="/super-admin/salons/create"
              className="flex items-center gap-2 bg-white text-violet-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/90 transition-all shadow-lg"
            >
              <Plus size={15} />
              Add Vendor
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      {loading && !d ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Store} label="Total Vendors" value={d?.totalShops} gradient="bg-gradient-to-br from-violet-500 to-purple-600" />
          <StatCard icon={CheckCircle} label="Active" value={d?.activeShops} sub="Currently live" gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
          <StatCard icon={Clock} label="Inactive" value={(d?.totalShops ?? 0) - (d?.activeShops ?? 0)} sub="Paused / pending" gradient="bg-gradient-to-br from-amber-400 to-orange-500" />
          <StatCard icon={Users} label="Customers" value={d?.totalUsers} gradient="bg-gradient-to-br from-sky-500 to-blue-600" />
        </div>
      )}

      {/* Quick links row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Manage Vendors', desc: 'View, edit or suspend all vendors', icon: <Store size={18} />, to: '/super-admin/salons', color: 'bg-violet-50 text-violet-700 border-violet-200' },
          { label: 'Pending Approvals', desc: 'Review new vendor registrations', icon: <Clock size={18} />, to: '/super-admin/pending-salons', color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'Create New Vendor', desc: 'Add a salon, turf or clinic', icon: <Plus size={18} />, to: '/super-admin/salons/create', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        ].map(q => (
          <Link key={q.label} to={q.to} className={`flex items-center gap-4 p-5 rounded-2xl border ${q.color} hover:shadow-md transition-all bg-white`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${q.color}`}>{q.icon}</div>
            <div>
              <p className="font-semibold text-sm text-gray-900">{q.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{q.desc}</p>
            </div>
            <ArrowUpRight size={16} className="ml-auto text-gray-400" />
          </Link>
        ))}
      </div>

      {/* Recent vendors */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Recently Added Vendors</h2>
          <Link
            to="/super-admin/salons"
            className="flex items-center gap-1 text-sm text-violet-600 hover:text-violet-800 font-medium transition-colors"
          >
            View All <ArrowUpRight size={14} />
          </Link>
        </div>

        {loading && !d ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {d?.recentShops?.length > 0 ? (
              d.recentShops.map((salon) => {
                const catCfg = CATEGORY_CONFIG[salon.category] || CATEGORY_CONFIG.salon;
                return (
                  <div key={salon.shopId} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {salon.logo
                          ? <img src={salon.logo} alt={salon.shopName} className="w-full h-full object-cover rounded-xl" />
                          : <Store size={17} className="text-violet-500" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{salon.shopName}</p>
                        <p className="text-xs text-gray-400">{salon.shopId} · /{salon.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${catCfg.color}`}>
                        {catCfg.icon} {catCfg.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        salon.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${salon.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        {salon.status.charAt(0).toUpperCase() + salon.status.slice(1)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-14 text-center text-gray-400">
                <Store size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No vendors yet</p>
                <Link to="/super-admin/salons/create" className="mt-2 inline-flex items-center gap-1 text-sm text-violet-600 hover:underline">
                  Create your first vendor <ArrowUpRight size={13} />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
