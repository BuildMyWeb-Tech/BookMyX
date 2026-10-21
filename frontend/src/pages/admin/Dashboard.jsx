import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import {
  Users,
  Calendar,
  UserCircle,
  IndianRupee,
  Scissors,
  TrendingUp,
  Sparkles,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Dashboard = () => {
  const {
    aToken,
    getDashData,
    cancelAppointment,
    dashData,
    getAllAppointments,
    appointments,
  } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);
  const { shopSlug } = useParams();
  const shopDisplayName = shopSlug
    ? shopSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Salon';
  const [isLoading, setIsLoading] = useState(true);
  const [bookingTrends, setBookingTrends] = useState([]);
  const [servicePopularity, setServicePopularity] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [stylistPerformance, setStylistPerformance] = useState([]);
  const [customerRetention, setCustomerRetention] = useState([]);

  useEffect(() => {
    if (aToken) {
      setIsLoading(true);

      // getAllAppointments() is already called by SalonAdminContext on login;
      // only fetch dashData (lightweight aggregate) here to avoid duplicate requests.
      getDashData().finally(() => setIsLoading(false));
    }
  }, [aToken]);

  // Process appointments data for charts when appointments or dashData changes
  useEffect(() => {
    if (appointments && appointments.length > 0) {
      processBookingTrends();
      processServicePopularity();
      processRevenueData();
      processStylistPerformance();
      processCustomerRetention();
    }
  }, [appointments, dashData]);

  // Calculate booking trends (appointments per day)
  const processBookingTrends = () => {
    const bookingsByDate = {};
    const dates = [];
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      bookingsByDate[dateStr] = 0;
      dates.push(dateStr);
    }

    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.date || appointment.slotDate);
      const dateStr = appointmentDate.toISOString().split('T')[0];
      if (bookingsByDate[dateStr] !== undefined) {
        bookingsByDate[dateStr]++;
      }
    });

    const chartData = dates.map((date) => ({
      date: date.slice(5),
      bookings: bookingsByDate[date],
    }));

    setBookingTrends(chartData);
  };

  const processServicePopularity = () => {
    const serviceCount = {};
    const defaultServices = ['Haircut & Style', 'Hair Coloring', 'Blowout & Styling', 'Hair Treatment', 'Beard Trim', 'Bridal Style'];
    defaultServices.forEach((service) => { serviceCount[service] = 0; });

    appointments.forEach((appointment) => {
      if (appointment.services && Array.isArray(appointment.services)) {
        appointment.services.forEach((service) => {
          if (service.name) {
            if (!serviceCount[service.name]) serviceCount[service.name] = 0;
            serviceCount[service.name]++;
          }
        });
      } else if (appointment.service) {
        if (!serviceCount[appointment.service]) serviceCount[appointment.service] = 0;
        serviceCount[appointment.service]++;
      }
      if (!appointment.service && !appointment.services) {
        serviceCount['Haircut & Style']++;
      }
    });

    const serviceData = Object.entries(serviceCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setServicePopularity(serviceData);
  };

  const processRevenueData = () => {
    const revenueByMonth = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${month.getFullYear()}-${month.getMonth()}`;
      revenueByMonth[monthKey] = { name: monthNames[month.getMonth()], revenue: 0, completedRevenue: 0 };
    }

    appointments.forEach((appointment) => {
      if (appointment.amount) {
        const appointmentDate = new Date(appointment.date || appointment.slotDate);
        const monthKey = `${appointmentDate.getFullYear()}-${appointmentDate.getMonth()}`;
        if (revenueByMonth[monthKey]) {
          revenueByMonth[monthKey].revenue += appointment.amount;
          if (appointment.isCompleted) revenueByMonth[monthKey].completedRevenue += appointment.amount;
        }
      }
    });

    setRevenueData(Object.values(revenueByMonth));
  };

  const processCustomerRetention = () => {
    const appointmentsByCustomer = {};
    appointments.forEach((appointment) => {
      const customerId = appointment.userId || 'unknown';
      if (!appointmentsByCustomer[customerId]) appointmentsByCustomer[customerId] = 0;
      appointmentsByCustomer[customerId]++;
    });

    const customersByAppointmentCount = { '1 visit': 0, '2-3 visits': 0, '4-5 visits': 0, '6+ visits': 0 };
    Object.values(appointmentsByCustomer).forEach((count) => {
      if (count === 1) customersByAppointmentCount['1 visit']++;
      else if (count >= 2 && count <= 3) customersByAppointmentCount['2-3 visits']++;
      else if (count >= 4 && count <= 5) customersByAppointmentCount['4-5 visits']++;
      else customersByAppointmentCount['6+ visits']++;
    });

    setCustomerRetention(Object.entries(customersByAppointmentCount).map(([name, value]) => ({ name, value })));
  };

  const calculateTotalRevenue = () => {
    if (!appointments || appointments.length === 0) return 0;
    return appointments.reduce((total, appointment) => {
      if (appointment.amount && !appointment.cancelled) return total + Number(appointment.amount);
      return total;
    }, 0);
  };

  const countTodayAppointments = () => {
    if (!appointments || appointments.length === 0) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return appointments.filter((app) => {
      const appDate = new Date(app.date || app.slotDate || app.createdAt);
      return appDate >= today && appDate < tomorrow && !app.cancelled;
    }).length;
  };

  const calculateMonthlyRevenue = () => {
    if (!appointments || appointments.length === 0) return 0;
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return appointments.reduce((total, appointment) => {
      if (appointment.amount && !appointment.cancelled) {
        const appDate = new Date(appointment.date || appointment.slotDate || appointment.createdAt);
        if (appDate >= firstDayOfMonth && appDate < firstDayOfNextMonth) return total + Number(appointment.amount);
      }
      return total;
    }, 0);
  };

  const calculateCompletionRate = () => {
    if (!appointments || appointments.length === 0) return 0;
    const completedCount = appointments.filter((app) => app.isCompleted && !app.cancelled).length;
    const totalValidCount = appointments.filter((app) => !app.cancelled).length;
    return totalValidCount ? Math.round((completedCount / totalValidCount) * 100) : 0;
  };

  const processStylistPerformance = () => {
    const stylistStats = {};
    appointments.forEach((appointment) => {
      const stylistId = appointment.docId || appointment.doctorId;
      const stylistName = appointment.docData?.name || 'Unknown';
      if (!stylistStats[stylistId]) {
        stylistStats[stylistId] = { name: stylistName, appointments: 0, completed: 0, revenue: 0 };
      }
      stylistStats[stylistId].appointments++;
      if (appointment.isCompleted) stylistStats[stylistId].completed++;
      if (appointment.amount) stylistStats[stylistId].revenue += appointment.amount;
    });

    const performanceData = Object.values(stylistStats)
      .map((stylist) => ({
        ...stylist,
        completionRate: stylist.appointments > 0 ? Math.round((stylist.completed / stylist.appointments) * 100) : 0,
      }))
      .sort((a, b) => b.appointments - a.appointments);

    setStylistPerformance(performanceData);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">Loading salon dashboard data...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Stylists / Staff', value: dashData?.stylists || dashData?.doctors || 0, sub: 'Professionals on roster', icon: <Scissors size={22} />, color: 'bg-blue-500', light: 'bg-blue-50 text-blue-600' },
    { label: 'Total Bookings', value: dashData?.appointments || 0, sub: 'All-time sessions booked', icon: <Calendar size={22} />, color: 'bg-violet-500', light: 'bg-violet-50 text-violet-600' },
    { label: 'Customers', value: dashData?.clients || dashData?.patients || 0, sub: 'Registered clientele', icon: <UserCircle size={22} />, color: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Revenue', value: formatCurrency(dashData?.revenue || calculateTotalRevenue() || 0), sub: 'All-time earnings', icon: <IndianRupee size={22} />, color: 'bg-amber-500', light: 'bg-amber-50 text-amber-600' },
    { label: "Today's Sessions", value: dashData?.todaysAppointments || countTodayAppointments() || 0, sub: 'Scheduled for today', icon: <Sparkles size={22} />, color: 'bg-pink-500', light: 'bg-pink-50 text-pink-600' },
    { label: 'Monthly Revenue', value: formatCurrency(calculateMonthlyRevenue() || 0), sub: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }), icon: <TrendingUp size={22} />, color: 'bg-indigo-500', light: 'bg-indigo-50 text-indigo-600' },
    { label: 'Completion Rate', value: `${calculateCompletionRate()}%`, sub: 'Sessions completed', icon: <Award size={22} />, color: 'bg-teal-500', light: 'bg-teal-50 text-teal-600' },
  ];

  return (
    dashData && (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{shopDisplayName} Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here&apos;s what&apos;s happening today.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <Calendar size={14} className="text-primary" />
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
                <span className={`w-9 h-9 rounded-xl ${s.light} flex items-center justify-center flex-shrink-0`}>{s.icon}</span>
              </div>
              <p className="text-2xl font-extrabold text-gray-900 leading-none mb-1">{s.value}</p>
              <p className="text-[11px] text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center"><TrendingUp size={15} className="text-blue-600" /></span>
              Booking Trends (Last 30 days)
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingTrends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bookings" stroke="#8884d8" strokeWidth={2} name="Salon Appointments" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center"><Scissors size={15} className="text-emerald-600" /></span>
              Most Popular Services
            </h3>
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-4 h-auto lg:h-80">
              <div className="w-full lg:w-[60%] h-64 sm:h-72 md:h-80 lg:h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={servicePopularity} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of Bookings" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full lg:w-[40%] h-64 sm:h-72 md:h-80 lg:h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={servicePopularity} cx="50%" cy="50%" innerRadius="55%" outerRadius="75%" paddingAngle={5} dataKey="count" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {servicePopularity.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Bookings']} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center"><IndianRupee size={15} className="text-amber-600" /></span>
              Revenue Analytics (6 months)
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Total Revenue" />
                  <Bar dataKey="completedRevenue" fill="#82ca9d" name="Revenue from Completed Services" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center"><Users size={15} className="text-violet-600" /></span>
              Staff Performance
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stylistPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="appointments" fill="#8884d8" name="Total Styling Sessions" />
                  <Bar dataKey="completed" fill="#82ca9d" name="Completed Sessions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
