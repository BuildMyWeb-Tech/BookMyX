import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Store, User, Phone, Eye, EyeOff, Upload, Check, X, Sparkles,
  Scissors, Dumbbell, Stethoscope, ChevronRight, ArrowLeft,
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CATEGORIES = [
  {
    id: 'salon',
    label: 'Salon & Spa',
    icon: Scissors,
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-600',
    ring: 'ring-rose-400',
    desc: 'Hair salons, beauty parlors, spas, nail studios',
  },
  {
    id: 'turf',
    label: 'Sports Turf',
    icon: Dumbbell,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-600',
    ring: 'ring-emerald-400',
    desc: 'Football, cricket, badminton, multi-sport facilities',
  },
  {
    id: 'doctor_clinic',
    label: 'Doctor / Clinic',
    icon: Stethoscope,
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    ring: 'ring-blue-400',
    desc: 'Clinics, hospitals, diagnostic centers, specialists',
  },
];

const Field = ({ label, required, children, hint, className = '' }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all bg-white placeholder-gray-400"
  />
);

const Section = ({ title, icon: Icon, children, accentClass = 'bg-primary/10 text-primary' }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
      <div className={`w-8 h-8 rounded-lg ${accentClass} flex items-center justify-center`}>
        <Icon size={16} />
      </div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
  </div>
);

const INITIAL = {
  shopName: '', address: '', city: '', state: '', pincode: '',
  phone: '', email: '', whatsapp: '', gstNumber: '',
  adminName: '', adminId: '', adminEmail: '', adminPassword: '',
  // Turf
  turfSurface: '', turfSize: '', turfSports: '', turfFacilities: '', turfPricePerSlot: '', turfSlotDuration: '60',
  // Clinic
  clinicType: '', specializations: '', registrationNumber: '', emergencyContact: '',
};

export default function CreateYourSalon() {
  const [step, setStep] = useState(1); // 1 = pick category, 2 = fill form
  const [category, setCategory] = useState(null);
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const logoRef = useRef(null);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Logo must be under 5MB'); return; }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const selectCategory = (cat) => {
    setCategory(cat);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ['shopName', 'adminName', 'adminId', 'adminEmail', 'adminPassword'];
    for (const key of required) {
      if (!form[key].trim()) { toast.error(`${key.replace(/([A-Z])/g, ' $1')} is required`); return; }
    }
    if (form.adminPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('category', category.id);
    if (logoFile) fd.append('logo', logoFile);

    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/salon-request`, fd);
      if (data.success) {
        setSubmitted(true);
        toast.success('Request submitted successfully!');
      } else {
        toast.error(data.message || 'Submission failed');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const activeCat = category || CATEGORIES[0];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <Check size={28} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Request Submitted!</h2>
          <p className="text-gray-500 text-sm">
            Your {activeCat.label} registration request has been submitted. Our team will review and contact you within 1–2 business days.
          </p>
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 text-sm text-violet-700 text-left space-y-1">
            <p><span className="font-semibold">Business:</span> {form.shopName}</p>
            <p><span className="font-semibold">Category:</span> {activeCat.label}</p>
            <p><span className="font-semibold">Admin ID:</span> {form.adminId}</p>
            <p><span className="font-semibold">Email:</span> {form.adminEmail}</p>
          </div>
          <button
            onClick={() => { setSubmitted(false); setForm(INITIAL); setLogoFile(null); setLogoPreview(null); setStep(1); setCategory(null); }}
            className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-all"
          >
            Submit Another Request
          </button>
          <a href="/" className="block text-sm text-violet-600 hover:underline">← Back to BookmyX</a>
        </div>
      </div>
    );
  }

  // ── Step 1: Category Selection ─────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-14 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <a href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 mb-6">
              <Sparkles size={14} className="text-violet-600" />
              <span className="font-bold text-violet-700">BookmyX</span>
            </a>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Register Your Business</h1>
            <p className="text-gray-500">Choose the category that best describes your business to get started.</p>
          </div>
          <div className="space-y-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat)}
                className={`w-full flex items-center gap-5 p-6 rounded-2xl border-2 bg-white hover:shadow-md transition-all group ${cat.border} hover:${cat.ring} hover:ring-2`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shrink-0`}>
                  <cat.icon size={26} className="text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-gray-900 text-lg">{cat.label}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{cat.desc}</div>
                </div>
                <ChevronRight size={20} className={`${cat.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-8">
            Already have an account? <a href="/super-admin/login" className="text-violet-600 hover:underline">Super Admin Login</a>
          </p>
        </div>
      </div>
    );
  }

  // ── Step 2: Registration Form ───────────────────────────────────────────────
  const labelMap = {
    salon: { shopLabel: 'Salon / Spa Name', addressSection: 'Salon Information' },
    turf: { shopLabel: 'Turf / Ground Name', addressSection: 'Turf Information' },
    doctor_clinic: { shopLabel: 'Clinic / Hospital Name', addressSection: 'Clinic Information' },
  };
  const labels = labelMap[category.id];

  return (
    <div className={`min-h-screen py-10 px-4 bg-gradient-to-br from-${category.id === 'salon' ? 'rose' : category.id === 'turf' ? 'emerald' : 'blue'}-50 via-white to-white`}>
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <div className="text-center space-y-2">
          <button onClick={() => setStep(1)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2">
            <ArrowLeft size={14} /> Change category
          </button>
          <div className={`inline-flex items-center gap-2 ${activeCat.bg} ${activeCat.text} px-4 py-1.5 rounded-full text-sm font-medium`}>
            <activeCat.icon size={14} /> Register as {activeCat.label}
          </div>
          <h1 className="text-3xl font-bold text-gray-800">{labels.shopLabel}</h1>
          <p className="text-gray-500 max-w-lg mx-auto text-sm">
            Fill in your details. Our team will review and activate your account within 1–2 business days.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Logo */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-5">
              <div
                onClick={() => logoRef.current.click()}
                className={`w-20 h-20 rounded-2xl border-2 border-dashed ${activeCat.border} hover:border-current cursor-pointer flex items-center justify-center overflow-hidden transition-all group`}
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className={`text-center ${activeCat.text} opacity-50 group-hover:opacity-100 transition-opacity`}>
                    <Upload size={22} className="mx-auto" />
                    <p className="text-xs mt-1">Logo</p>
                  </div>
                )}
              </div>
              <input ref={logoRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" />
              <div>
                <p className="font-medium text-gray-800 text-sm">Business Logo</p>
                <p className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 5MB. Optional.</p>
                {logoPreview && (
                  <button type="button" onClick={() => { setLogoPreview(null); setLogoFile(null); }}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500 mt-1">
                    <X size={12} /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Business Info */}
          <Section title={labels.addressSection} icon={Store} accentClass={`${activeCat.bg} ${activeCat.text}`}>
            <Field label={labels.shopLabel} required>
              <Input value={form.shopName} onChange={set('shopName')} placeholder={category.id === 'salon' ? 'e.g. Glamour Studio' : category.id === 'turf' ? 'e.g. City Sports Turf' : 'e.g. HealthFirst Clinic'} />
            </Field>
            <Field label="Address">
              <Input value={form.address} onChange={set('address')} placeholder="Street address" />
            </Field>
            <Field label="City">
              <Input value={form.city} onChange={set('city')} placeholder="City" />
            </Field>
            <Field label="State">
              <Input value={form.state} onChange={set('state')} placeholder="State" />
            </Field>
            <Field label="Pincode">
              <Input value={form.pincode} onChange={set('pincode')} placeholder="Pincode" />
            </Field>
            <Field label="GST Number">
              <Input value={form.gstNumber} onChange={set('gstNumber')} placeholder="GSTIN (optional)" />
            </Field>
          </Section>

          {/* Contact */}
          <Section title="Contact Details" icon={Phone} accentClass={`${activeCat.bg} ${activeCat.text}`}>
            <Field label="Phone">
              <Input value={form.phone} onChange={set('phone')} placeholder="+91 9876543210" />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={set('email')} placeholder="info@yourbusiness.com" />
            </Field>
            <Field label="WhatsApp">
              <Input value={form.whatsapp} onChange={set('whatsapp')} placeholder="+91 9876543210" />
            </Field>
          </Section>

          {/* Category-specific fields */}
          {category.id === 'turf' && (
            <Section title="Turf Details" icon={Dumbbell} accentClass="bg-emerald-50 text-emerald-600">
              <Field label="Surface Type">
                <select value={form.turfSurface} onChange={set('turfSurface')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                  <option value="">Select surface</option>
                  <option>Natural Grass</option>
                  <option>Artificial Turf</option>
                  <option>Concrete</option>
                  <option>Clay</option>
                  <option>Synthetic</option>
                </select>
              </Field>
              <Field label="Turf Size">
                <select value={form.turfSize} onChange={set('turfSize')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                  <option value="">Select size</option>
                  <option>5-a-side</option>
                  <option>7-a-side</option>
                  <option>Full size (11-a-side)</option>
                  <option>Badminton Court</option>
                  <option>Cricket Pitch</option>
                </select>
              </Field>
              <Field label="Sports Available" hint="Comma-separated: football, cricket, badminton">
                <Input value={form.turfSports} onChange={set('turfSports')} placeholder="football, cricket, badminton" />
              </Field>
              <Field label="Facilities" hint="Comma-separated: parking, floodlights, changing room">
                <Input value={form.turfFacilities} onChange={set('turfFacilities')} placeholder="floodlights, parking, changing room" />
              </Field>
              <Field label="Price per Slot (₹)">
                <Input type="number" value={form.turfPricePerSlot} onChange={set('turfPricePerSlot')} placeholder="500" />
              </Field>
              <Field label="Slot Duration (minutes)">
                <select value={form.turfSlotDuration} onChange={set('turfSlotDuration')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                  <option value="60">60 min (1 hour)</option>
                  <option value="90">90 min (1.5 hours)</option>
                  <option value="120">120 min (2 hours)</option>
                </select>
              </Field>
            </Section>
          )}

          {category.id === 'doctor_clinic' && (
            <Section title="Clinic / Hospital Details" icon={Stethoscope} accentClass="bg-blue-50 text-blue-600">
              <Field label="Facility Type">
                <select value={form.clinicType} onChange={set('clinicType')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white">
                  <option value="">Select type</option>
                  <option value="clinic">Clinic</option>
                  <option value="hospital">Hospital</option>
                  <option value="diagnostic">Diagnostic Center</option>
                </select>
              </Field>
              <Field label="Specializations" hint="Comma-separated: General, Pediatrics, Dermatology">
                <Input value={form.specializations} onChange={set('specializations')} placeholder="General, Pediatrics, Dermatology" />
              </Field>
              <Field label="Registration Number">
                <Input value={form.registrationNumber} onChange={set('registrationNumber')} placeholder="MCI/State reg. number" />
              </Field>
              <Field label="Emergency Contact">
                <Input value={form.emergencyContact} onChange={set('emergencyContact')} placeholder="+91 9876543210" />
              </Field>
            </Section>
          )}

          {/* Admin Account */}
          <Section title="Your Admin Account" icon={User} accentClass={`${activeCat.bg} ${activeCat.text}`}>
            <Field label="Your Name" required>
              <Input value={form.adminName} onChange={set('adminName')} placeholder="Full name" />
            </Field>
            <Field label="Admin Login ID" required hint="Used to log in to your dashboard (e.g. myname123)">
              <Input value={form.adminId} onChange={set('adminId')} placeholder="myname123" />
            </Field>
            <Field label="Admin Email" required>
              <Input type="email" value={form.adminEmail} onChange={set('adminEmail')} placeholder="admin@yourbusiness.com" />
            </Field>
            <Field label="Password" required>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.adminPassword}
                  onChange={set('adminPassword')}
                  placeholder="Min 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-12 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white placeholder-gray-400"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
          </Section>

          {/* Submit */}
          <div className="pb-10">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${activeCat.color} hover:opacity-90 disabled:opacity-50 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-sm text-base`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Submit {activeCat.label} Registration Request
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              After review, our team will activate your account. Typical response: 1–2 business days.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
