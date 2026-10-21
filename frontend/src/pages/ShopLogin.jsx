import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff, Scissors, Stethoscope, Dumbbell, ArrowLeft } from 'lucide-react';

const CATEGORY_THEME = {
  salon: {
    gradient: 'from-blue-600 to-indigo-700',
    ring: 'focus:ring-blue-500/30 focus:border-blue-500',
    btn: 'from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800',
    link: 'text-blue-600 hover:text-blue-800',
    icon: <Scissors size={26} className="text-white" />,
    label: 'Salon',
  },
  doctor_clinic: {
    gradient: 'from-sky-500 to-cyan-600',
    ring: 'focus:ring-sky-500/30 focus:border-sky-500',
    btn: 'from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700',
    link: 'text-sky-600 hover:text-sky-800',
    icon: <Stethoscope size={26} className="text-white" />,
    label: 'Clinic',
  },
  turf: {
    gradient: 'from-emerald-600 to-teal-700',
    ring: 'focus:ring-emerald-500/30 focus:border-emerald-500',
    btn: 'from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800',
    link: 'text-emerald-600 hover:text-emerald-800',
    icon: <Dumbbell size={26} className="text-white" />,
    label: 'Turf',
  },
};

const ShopLogin = () => {
  const { shopSlug } = useParams();
  const { currentShop } = useContext(ShopContext);
  const { backendUrl, token, setToken, loadUserProfileData } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const shopName = currentShop?.shopName || (shopSlug ? shopSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Shop');
  const s = shopSlug || '';
  const cat = currentShop?.category || 'salon';
  const theme = CATEGORY_THEME[cat] || CATEGORY_THEME.salon;

  useEffect(() => {
    if (token) navigate(`/${s}`);
  }, [token]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (state === 'Sign Up') {
        if (!/^\d{10}$/.test(phone)) {
          toast.error('Phone number must be exactly 10 digits');
          setLoading(false);
          return;
        }
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password, phone, shopId: currentShop?.shopId || '' });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          await loadUserProfileData(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          await loadUserProfileData(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Back link */}
        <button
          onClick={() => navigate(`/${s}`)}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Back to {shopName}
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header banner */}
          <div className={`bg-gradient-to-r ${theme.gradient} p-8 text-center relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/3" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 ring-2 ring-white/30">
                {currentShop?.logo
                  ? <img src={currentShop.logo} alt={shopName} className="w-10 h-10 rounded-xl object-cover" />
                  : theme.icon}
              </div>
              <h1 className="text-xl font-bold text-white">{shopName}</h1>
              <p className="text-white/70 text-sm mt-1">
                {state === 'Login' ? 'Sign in to your account' : 'Create a new account'}
              </p>
            </div>
          </div>

          <div className="p-7">
            {/* Toggle tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              {['Login', 'Sign Up'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setState(tab)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    state === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-4">
              {state === 'Sign Up' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)} required
                    placeholder="Your full name"
                    className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${theme.ring} transition-all`}
                  />
                </div>
              )}

              {state === 'Sign Up' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Phone Number</label>
                  <input
                    type="tel" value={phone}
                    onChange={e => { const v = e.target.value.replace(/\D/g, ''); if (v.length <= 10) setPhone(v); }}
                    required placeholder="10-digit mobile number"
                    className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${theme.ring} transition-all`}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="your@email.com"
                  className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${theme.ring} transition-all`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} required
                    placeholder="Enter your password"
                    className={`w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 ${theme.ring} transition-all`}
                  />
                  <button
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className={`w-full bg-gradient-to-r ${theme.btn} disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg mt-2`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Please wait...
                  </>
                ) : state === 'Login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-5">
              {state === 'Login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setState(state === 'Login' ? 'Sign Up' : 'Login')}
                className={`${theme.link} font-semibold transition-colors`}
              >
                {state === 'Login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopLogin;
