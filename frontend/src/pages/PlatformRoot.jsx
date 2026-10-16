import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scissors, Dumbbell, Stethoscope, ArrowRight, Star, Users, Building2,
  CheckCircle, ChevronRight, Shield, Zap, Globe, Phone, Mail,
  Calendar, Clock, CreditCard, MessageCircle, Award, TrendingUp,
  MapPin, Sparkles, Heart, Activity, Timer, Target, Menu, X,
} from 'lucide-react';

const WHATSAPP_NUMBER = '919344095727';

const categories = [
  {
    id: 'salon',
    label: 'Salon & Spa',
    icon: Scissors,
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-700',
    desc: 'Haircuts, beauty treatments, spa services, nail care and more.',
    features: ['Stylist profiles & scheduling', 'Service catalogue with pricing', 'POS billing & coupons', 'WhatsApp broadcast'],
    slug: 'your-salon',
  },
  {
    id: 'turf',
    label: 'Sports Turf',
    icon: Dumbbell,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
    desc: 'Football, cricket, badminton and multi-sport turf bookings.',
    features: ['Hourly slot availability', 'Online slot reservations', 'Payment tracking', 'Facility showcase'],
    slug: 'your-turf',
  },
  {
    id: 'doctor',
    label: 'Doctor / Clinic',
    icon: Stethoscope,
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
    desc: 'Appointment management for clinics, hospitals and specialists.',
    features: ['Doctor profiles & specializations', 'Appointment slots', 'Patient management', 'Prescription & payment tracking'],
    slug: 'your-clinic',
  },
];

const stats = [
  { value: '500+', label: 'Vendors Onboarded', icon: Building2 },
  { value: '50K+', label: 'Bookings Made', icon: Calendar },
  { value: '3', label: 'Business Categories', icon: Layers2 },
  { value: '99.9%', label: 'Uptime', icon: Shield },
];

function Layers2(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/>
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
    </svg>
  );
}

export default function PlatformRoot() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('salon');

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I want to onboard my business on BookmyX')}`;

  const active = categories.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
              BookmyX
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-violet-600 transition-colors">Features</a>
            <a href="#categories" className="hover:text-violet-600 transition-colors">Categories</a>
            <a href="#how-it-works" className="hover:text-violet-600 transition-colors">How It Works</a>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="hover:text-violet-600 transition-colors">Contact</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a href="/super-admin/login" className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">Admin Login</a>
            <button
              onClick={() => navigate('/create-salon')}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              Register Business <ArrowRight size={14} />
            </button>
          </div>
          <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3 text-sm">
            <a href="#features" className="text-gray-600 py-1" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#categories" className="text-gray-600 py-1" onClick={() => setMenuOpen(false)}>Categories</a>
            <a href="#how-it-works" className="text-gray-600 py-1" onClick={() => setMenuOpen(false)}>How It Works</a>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="text-gray-600 py-1">Contact</a>
            <button
              onClick={() => navigate('/create-salon')}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-medium text-center"
            >
              Register Your Business
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50 pt-20 pb-24">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles size={14} />
            India's Multi-Category Booking Platform
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            One Platform,<br />
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Every Business
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            BookmyX powers salons, sports turfs, and medical clinics with dedicated booking pages,
            real-time slots and complete business management — all under one roof.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/create-salon')}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-3.5 rounded-2xl font-semibold text-base hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-violet-200"
            >
              Register Your Business <ArrowRight size={18} />
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-gray-700 border border-gray-200 bg-white px-6 py-3.5 rounded-2xl font-medium hover:border-violet-300 hover:text-violet-700 transition-colors"
            >
              <MessageCircle size={18} className="text-green-500" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Category pills */}
        <div className="max-w-4xl mx-auto px-4 mt-14 flex flex-wrap justify-center gap-4">
          {categories.map(cat => (
            <div key={cat.id} className={`flex items-center gap-2 ${cat.bg} ${cat.border} border rounded-full px-5 py-2.5 text-sm font-medium ${cat.text} shadow-sm`}>
              <cat.icon size={16} />
              {cat.label}
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="flex justify-center mb-2">
                <s.icon size={22} className="text-violet-500" />
              </div>
              <div className="text-3xl font-extrabold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="categories" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Built for Your Business</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Choose your category and get a fully branded booking page with all tools your business needs.</p>
          </div>
          <div className="flex justify-center gap-3 mb-10 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-md`
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <cat.icon size={15} />
                {cat.label}
              </button>
            ))}
          </div>
          {active && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden max-w-4xl mx-auto">
              <div className={`bg-gradient-to-r ${active.color} px-8 py-10 text-white`}>
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <active.icon size={28} />
                  </div>
                  <div>
                    <div className={`inline-block ${active.badge} px-3 py-1 rounded-full text-xs font-semibold mb-2`}>{active.label}</div>
                    <h3 className="text-2xl font-bold mb-2">{active.label} Booking Platform</h3>
                    <p className="text-white/80">{active.desc}</p>
                  </div>
                </div>
              </div>
              <div className="p-8 grid sm:grid-cols-2 gap-4">
                {active.features.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <CheckCircle size={18} className={active.text} />
                    <span className="text-gray-700 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <div className="px-8 pb-8">
                <button
                  onClick={() => navigate('/create-salon')}
                  className={`bg-gradient-to-r ${active.color} text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:opacity-90 transition-opacity`}
                >
                  Register as {active.label} <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-gray-500 max-w-xl mx-auto">One platform with all the tools to run, grow and manage your business online.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: 'Your Own Booking Page', desc: 'Get a branded URL like /your-salon with a professional booking page.' },
              { icon: Calendar, title: 'Smart Slot Management', desc: 'Configure working hours, holidays and special schedules effortlessly.' },
              { icon: CreditCard, title: 'Online & Offline Payments', desc: 'Accept UPI, cash and card. Integrated QR code for instant collection.' },
              { icon: Shield, title: 'Strict Tenant Isolation', desc: 'Customer data, bookings and logins are fully isolated per vendor.' },
              { icon: Users, title: 'Staff / Stylist Panel', desc: 'Separate login for staff with their own appointment views.' },
              { icon: TrendingUp, title: 'Reports & Analytics', desc: 'Revenue charts, booking trends and business insights at a glance.' },
              { icon: MessageCircle, title: 'WhatsApp Broadcast', desc: 'Send bulk booking reminders and promotions directly on WhatsApp.' },
              { icon: Award, title: 'Coupons & Packages', desc: 'Create discount coupons and combo packages to boost retention.' },
              { icon: Zap, title: 'Real-Time Notifications', desc: 'Instant booking alerts via Socket.IO for admins and customers.' },
            ].map(f => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-md transition-all bg-white group">
                <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center mb-4 group-hover:bg-violet-100 transition-colors">
                  <f.icon size={20} className="text-violet-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{f.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-violet-50 to-indigo-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Get Started in Minutes</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Register Your Business', desc: 'Submit your details — name, category, contact and admin credentials.', icon: Building2 },
              { step: '02', title: 'Get Approved', desc: 'Our team reviews and activates your vendor account within 24 hours.', icon: CheckCircle },
              { step: '03', title: 'Go Live', desc: 'Access your admin panel and share your unique booking link with customers.', icon: Zap },
            ].map(s => (
              <div key={s.step} className="bg-white rounded-2xl p-7 shadow-sm border border-violet-100 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <s.icon size={22} className="text-white" />
                </div>
                <div className="text-5xl font-black text-violet-100 mb-2">{s.step}</div>
                <h4 className="font-bold text-gray-900 mb-2">{s.title}</h4>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-indigo-700 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Sparkles size={32} className="mx-auto mb-4 text-violet-200" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-violet-200 mb-8 text-lg">Join hundreds of vendors who trust BookmyX for their online booking needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/create-salon')}
              className="bg-white text-violet-700 px-8 py-3.5 rounded-2xl font-semibold hover:bg-violet-50 transition-colors flex items-center justify-center gap-2"
            >
              Register Now <ArrowRight size={18} />
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="border border-white/30 text-white px-8 py-3.5 rounded-2xl font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} /> Talk to Us
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">BookmyX</span>
          </div>
          <p className="text-sm text-center">© 2026 BookmyX. All rights reserved. | Multi-Category Booking Platform</p>
          <div className="flex gap-4 text-sm">
            <a href={`/super-admin/login`} className="hover:text-white transition-colors">Super Admin</a>
            <a href="/create-salon" className="hover:text-white transition-colors">Register</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
