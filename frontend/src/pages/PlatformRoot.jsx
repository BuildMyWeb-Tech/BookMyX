import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scissors, Dumbbell, Stethoscope, Star, ChevronRight, ArrowRight,
  CheckCircle, Users, Calendar, Shield, Zap, MapPin,
  Globe, Menu, X, TrendingUp, Award, Heart,
  Play, Sparkles,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────
// Static data
// ──────────────────────────────────────────────────────────────
const STATS = [
  { value: '500+', label: 'Vendors onboarded', icon: <Award size={20} /> },
  { value: '50K+', label: 'Bookings completed', icon: <Calendar size={20} /> },
  { value: '98%', label: 'Satisfaction rate', icon: <Heart size={20} /> },
  { value: '25+', label: 'Cities covered', icon: <MapPin size={20} /> },
];

const CATEGORIES = [
  {
    key: 'salon',
    icon: <Scissors size={28} />,
    label: 'Salon & Beauty',
    tagline: 'Hair, nails, skincare & more',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    accent: 'text-blue-600',
    description: 'Premium salon experiences with expert stylists, real-time availability, and instant booking.',
    features: ['Stylist selection', 'Service packages', 'Coupons & loyalty', 'Billing & receipts'],
    emoji: '✂️',
  },
  {
    key: 'turf',
    icon: <Dumbbell size={28} />,
    label: 'Sports Turf',
    tagline: 'Cricket, football, badminton & more',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    accent: 'text-emerald-600',
    description: 'Book your favourite sports ground by the hour with transparent pricing and instant confirmation.',
    features: ['Hourly slot booking', 'Multi-sport grounds', 'Online payment', 'Cancellation support'],
    emoji: '⚽',
  },
  {
    key: 'doctor_clinic',
    icon: <Stethoscope size={28} />,
    label: 'Doctor & Clinic',
    tagline: 'Consultations, check-ups & more',
    color: 'from-sky-500 to-cyan-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-700',
    accent: 'text-sky-600',
    description: 'Seamless clinic management — patient scheduling, doctor availability, and smart reminders.',
    features: ['Doctor profiles', 'Appointment slots', 'Patient management', 'Notifications'],
    emoji: '🏥',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Salon owner · Mumbai',
    avatar: 'PS',
    rating: 5,
    text: 'BookmyX transformed how we manage appointments. Our no-shows dropped by 60% and revenue is up.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Rahul Menon',
    role: 'Turf manager · Bangalore',
    avatar: 'RM',
    rating: 5,
    text: 'We went from pen-and-paper booking to fully digital in 2 days. Customers love the online slots.',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Dr. Anita Rao',
    role: 'Clinic · Hyderabad',
    avatar: 'AR',
    rating: 5,
    text: 'Patient management has never been easier. The notification system alone saves my staff 2 hours daily.',
    color: 'bg-sky-100 text-sky-700',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Register your business',
    desc: 'Sign up, submit your details and get approved by our team within 24 hours.',
    icon: <Globe size={22} />,
  },
  {
    step: '02',
    title: 'Set up your storefront',
    desc: 'Add services, staff, pricing, slots and working hours — all from one dashboard.',
    icon: <Zap size={22} />,
  },
  {
    step: '03',
    title: 'Start accepting bookings',
    desc: 'Customers find your page, book instantly, and receive automatic confirmations.',
    icon: <Calendar size={22} />,
  },
];

// ──────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────
export default function PlatformRoot() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Auto-cycle categories
  useEffect(() => {
    const t = setInterval(() => setActiveCategory(c => (c + 1) % CATEGORIES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const cat = CATEGORIES[activeCategory];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* ─── NAVBAR ─────────────────────────────────────────── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-700 rounded-lg flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900">BookmyX</span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {['Features', 'How it works', 'Categories'].map(item => (
                <button key={item} className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'}`}>
                  {item}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate('/super-admin')}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'}`}
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/create-salon')}
                className="text-sm font-semibold px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl hover:opacity-90 transition-all shadow-lg shadow-violet-200"
              >
                List your business
              </button>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            {['Features', 'How it works', 'Categories'].map(item => (
              <button key={item} className="block w-full text-left text-sm font-medium text-gray-700 py-2">{item}</button>
            ))}
            <div className="pt-2 space-y-2">
              <button onClick={() => navigate('/create-salon')} className="block w-full text-center py-3 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl text-sm font-semibold">
                List your business
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─── HERO ───────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-violet-950 to-purple-900">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -right-32 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 rounded-full px-4 py-1.5 text-xs font-medium mb-8 backdrop-blur-sm">
            <Sparkles size={12} className="text-violet-300" />
            India&apos;s fastest growing booking platform
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
            One platform,
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
              every booking.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            BookmyX powers salons, sports turfs, and clinics with a smart booking system your customers will love.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/create-salon')}
              className="group flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl shadow-violet-900/40 transition-all text-base"
            >
              Get started free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center gap-2 text-white/80 hover:text-white font-medium px-6 py-4 rounded-2xl border border-white/20 hover:border-white/40 transition-all text-sm backdrop-blur-sm">
              <Play size={16} className="fill-current" />
              Watch demo
            </button>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {CATEGORIES.map((c, i) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  i === activeCategory
                    ? 'bg-white text-gray-900 border-white shadow-lg'
                    : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
                }`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ─── STATS ──────────────────────────────────────────── */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  {s.icon}
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mb-1">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5 mb-4 tracking-widest uppercase">
              What we support
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              Built for every <span className="text-violet-600">vertical</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Each category gets a tailored experience — with the right features, the right UI, and the right workflows.
            </p>
          </div>

          {/* Tab selector */}
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {CATEGORIES.map((c, i) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  i === activeCategory
                    ? `bg-gradient-to-r ${c.color} text-white border-transparent shadow-lg`
                    : `${c.bg} ${c.text} ${c.border} hover:shadow-sm`
                }`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>

          {/* Category detail card */}
          <div className={`rounded-3xl border ${cat.border} ${cat.bg} p-8 sm:p-12 transition-all`}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {cat.icon}
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-3">{cat.label}</h3>
                <p className={`text-sm font-medium ${cat.accent} mb-4`}>{cat.tagline}</p>
                <p className="text-gray-600 mb-6 leading-relaxed">{cat.description}</p>
                <ul className="space-y-2 mb-8">
                  {cat.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <CheckCircle size={16} className={cat.accent} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/create-salon')}
                  className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${cat.color} text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-lg`}
                >
                  Register as {cat.label} <ChevronRight size={16} />
                </button>
              </div>

              {/* Visual placeholder — feature grid */}
              <div className="grid grid-cols-2 gap-3">
                {['Dashboard', 'Bookings', 'Customers', 'Analytics', 'Payments', 'Settings'].map((item, idx) => (
                  <div key={item} className={`bg-white rounded-2xl border border-white/80 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${idx === 0 ? 'col-span-2' : ''}`}>
                    <div className={`w-8 h-8 bg-gradient-to-br ${cat.color} rounded-lg flex items-center justify-center mb-2`}>
                      <div className="w-3 h-3 bg-white/80 rounded-sm" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">{item}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Feature module</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5 mb-4 tracking-widest uppercase">
              Simple onboarding
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900">Up and running in minutes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-violet-200 to-transparent z-0" />
                )}
                <div className="relative z-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-all">
                  <div className="text-5xl font-black text-gray-100 mb-4 leading-none">{step.step}</div>
                  <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ──────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900">Everything you need</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">One platform that covers the full lifecycle — from booking to billing to analytics.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Calendar size={22} />, title: 'Smart Scheduling', desc: 'Dynamic slot generation with block dates, holidays and buffer times.', color: 'bg-violet-100 text-violet-600' },
              { icon: <Users size={22} />, title: 'Staff Management', desc: 'Manage stylists, doctors or staff with individual profiles and availability.', color: 'bg-blue-100 text-blue-600' },
              { icon: <TrendingUp size={22} />, title: 'Revenue Analytics', desc: 'Track bookings, earnings, and trends with beautiful real-time charts.', color: 'bg-emerald-100 text-emerald-600' },
              { icon: <Shield size={22} />, title: 'Secure Payments', desc: 'Integrated payment tracking with bill generation and tax settings.', color: 'bg-sky-100 text-sky-600' },
              { icon: <Zap size={22} />, title: 'Instant Notifications', desc: 'Real-time alerts via Socket.IO and WhatsApp broadcast to your customers.', color: 'bg-orange-100 text-orange-600' },
              { icon: <Star size={22} />, title: 'Coupons & Packages', desc: 'Drive retention with discount coupons, loyalty packages and special deals.', color: 'bg-pink-100 text-pink-600' },
            ].map((f, i) => (
              <div key={i} className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900">Loved by businesses</h2>
            <p className="text-gray-500 mt-4">Real feedback from real vendors using BookmyX every day.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 hover:shadow-md transition-all">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-xs font-bold`}>{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-6">🚀</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
            Ready to grow your business?
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Join hundreds of businesses already using BookmyX to streamline bookings and delight customers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/create-salon')}
              className="group flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-base"
            >
              Start for free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/super-admin')}
              className="flex items-center gap-2 text-white/80 hover:text-white font-medium px-6 py-4 rounded-2xl border border-white/30 hover:border-white/60 transition-all text-sm"
            >
              Sign in to your dashboard
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="font-bold text-lg text-white">BookmyX</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                The all-in-one booking platform for salons, sports turfs, and clinics across India.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Platform</h4>
              <ul className="space-y-2 text-sm">
                {['Features', 'Pricing', 'How it works', 'API'].map(i => <li key={i}><a href="#" className="hover:text-white transition-colors">{i}</a></li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm">
                {['About', 'Blog', 'Careers', 'Contact'].map(i => <li key={i}><a href="#" className="hover:text-white transition-colors">{i}</a></li>)}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs">© 2025 BookmyX. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
