import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { SalonAdminContext } from '../../context/SalonAdminContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Scissors, Stethoscope, Dumbbell, Sparkles, Lock } from 'lucide-react';

const CATEGORY_THEME = {
  salon: {
    gradient: 'from-blue-600 via-blue-700 to-indigo-800',
    ring: 'focus:ring-blue-500/30 focus:border-blue-500',
    btn: 'from-blue-600 to-indigo-700',
    icon: <Scissors size={26} className="text-white" />,
    label: 'Salon Admin',
    tagline: 'Manage your salon from one dashboard',
    particleColor: 'bg-blue-400/20',
  },
  doctor_clinic: {
    gradient: 'from-sky-500 via-sky-600 to-cyan-700',
    ring: 'focus:ring-sky-500/30 focus:border-sky-500',
    btn: 'from-sky-500 to-cyan-600',
    icon: <Stethoscope size={26} className="text-white" />,
    label: 'Clinic Admin',
    tagline: 'Manage appointments and patient care',
    particleColor: 'bg-sky-400/20',
  },
  turf: {
    gradient: 'from-emerald-600 via-emerald-700 to-teal-800',
    ring: 'focus:ring-emerald-500/30 focus:border-emerald-500',
    btn: 'from-emerald-600 to-teal-700',
    icon: <Dumbbell size={26} className="text-white" />,
    label: 'Turf Admin',
    tagline: 'Manage your turf slots and bookings',
    particleColor: 'bg-emerald-400/20',
  },
};

// eslint-disable-next-line react/prop-types
const SalonAdminLogin = ({ shopSlug, shopName }) => {
  const { setSaAdminToken, backendUrl } = useContext(SalonAdminContext);
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stylistEnabled, setStylistEnabled] = useState(false);
  const [shopCategory, setShopCategory] = useState('salon');

  useEffect(() => {
    if (!shopSlug) return;
    axios.get(`${backendUrl}/api/salon-admin/public-info/${shopSlug}`)
      .then(({ data }) => {
        if (data.success) {
          setStylistEnabled(data.stylistPanelEnabled);
          if (data.category) setShopCategory(data.category);
        }
      })
      .catch(() => {});
  }, [shopSlug]);

  const theme = CATEGORY_THEME[shopCategory] || CATEGORY_THEME.salon;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/salon-admin/login`, { adminId, password });
      if (data.success) {
        setSaAdminToken(data.token);
        localStorage.setItem('saAdminToken', data.token);
        localStorage.setItem('shopInfo', JSON.stringify({
          shopId: data.shopId, shopName: data.shopName, slug: data.shopSlug
        }));
        toast.success(`Welcome to ${data.shopName}`);
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-br ${theme.gradient} p-8 text-center relative overflow-hidden`}>
            {/* Decorative circles */}
            <div className={`absolute -top-8 -right-8 w-32 h-32 ${theme.particleColor} rounded-full`} />
            <div className={`absolute -bottom-6 -left-6 w-24 h-24 ${theme.particleColor} rounded-full`} />
            <div className={`absolute top-1/2 left-1/4 w-16 h-16 ${theme.particleColor} rounded-full`} />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 ring-2 ring-white/30 shadow-xl">
                {theme.icon}
              </div>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Sparkles size={12} className="text-white/60" />
                <span className="text-white/60 text-xs font-medium tracking-wide uppercase">Admin Portal</span>
              </div>
              <h1 className="text-xl font-extrabold text-white">{shopName || theme.label}</h1>
              <p className="text-white/60 text-xs mt-1">{theme.tagline}</p>
            </div>
          </div>

          <div className="p-7">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Lock size={14} className="text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Secure Login</p>
                <p className="text-xs text-gray-400">Enter your admin credentials</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Admin ID</label>
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value.toLowerCase())}
                  required
                  placeholder="Enter your Admin ID"
                  className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${theme.ring} transition-all bg-gray-50 focus:bg-white`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className={`w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 ${theme.ring} transition-all bg-gray-50 focus:bg-white`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r ${theme.btn} disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg mt-2`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Login to Dashboard'
                )}
              </button>
            </form>

            {shopSlug && stylistEnabled && (
              <p className="text-center text-xs text-gray-400 mt-5 pt-4 border-t border-gray-100">
                Are you a stylist?{' '}
                <a
                  href={`/${shopSlug}/stylist`}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  Open Stylist Portal →
                </a>
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by <span className="font-semibold text-gray-600">BookmyX</span>
        </p>
      </div>
    </div>
  );
};

export default SalonAdminLogin;
