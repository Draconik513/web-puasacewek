import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useLocalStorage from '../hooks/useLocalStorage';
import JadwalSholat from './JadwalSholat';
import TasbihDigital from './TasbihDigital';
import DoaHarian from './DoaHarian';

export default function Dashboard({ ramadhanData, setActivePage }) {
  const [quote, setQuote] = useState({});
  const [ibadahList] = useLocalStorage('ibadahList', []);
  const [quranPages] = useLocalStorage('quranPages', { completed: 0, target: 300 });
  const [sedekahList] = useLocalStorage('sedekahList', []);
  const [weeklyProgress] = useLocalStorage('weeklyProgress', []);
  
  const islamicQuotes = [
    { text: "Sesungguhnya bersama kesulitan ada kemudahan", source: "QS. Al-Insyirah: 6" },
    { text: "Barangsiapa bertakwa kepada Allah, niscaya Dia akan membukakan jalan keluar baginya", source: "QS. At-Talaq: 2" },
    { text: "Dan bersabarlah. Sesungguhnya Allah beserta orang-orang yang sabar", source: "QS. Al-Anfal: 46" },
    { text: "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya", source: "HR. Ahmad" },
    { text: "Ramadhan adalah bulan yang penuh berkah", source: "HR. Nasa'i" },
    { text: "Berpuasalah maka kalian akan sehat", source: "HR. Thabrani" },
    { text: "Sesungguhnya Allah itu Maha Indah dan menyukai keindahan", source: "HR. Muslim" },
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * islamicQuotes.length);
    setQuote(islamicQuotes[randomIndex]);
  }, []);

  // Calculate fasting days from 18 Feb 2026 to 19 March 2026 (30 days)
  const calculateFastingDay = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ramadhanStart = new Date(2026, 1, 18); // 18 Feb 2026
    const ramadhanEnd = new Date(2026, 2, 19); // 19 March 2026 (hari ke-30)
    const idulFitri = new Date(2026, 2, 20); // 20 March 2026
    
    if (today < ramadhanStart) {
      const daysUntil = Math.ceil((ramadhanStart - today) / (1000 * 60 * 60 * 24));
      return { day: 0, remaining: daysUntil, status: 'before' };
    } else if (today > ramadhanEnd) {
      return { day: 30, remaining: 0, status: 'after' };
    } else {
      const diffTime = today - ramadhanStart;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const daysToIdulFitri = Math.ceil((idulFitri - today) / (1000 * 60 * 60 * 24));
      return { day: diffDays, remaining: daysToIdulFitri, status: 'during' };
    }
  };

  const { day: fastingDay, remaining: remainingDays, status: ramadhanStatus } = calculateFastingDay();

  // Calculate today's ibadah progress
  const completedIbadah = ibadahList.filter(i => i.completed).length;
  const totalIbadah = ibadahList.length || 13;
  const ibadahProgress = ramadhanStatus === 'before' ? 0 : (totalIbadah > 0 ? Math.round((completedIbadah / totalIbadah) * 100) : 0);

  // Calculate Quran progress
  const quranProgress = ((quranPages.completed / quranPages.target) * 100).toFixed(1);

  // Calculate total sedekah
  const totalSedekah = sedekahList.reduce((sum, item) => sum + item.amount, 0);
  const sedekahCount = sedekahList.length;

  // Format sedekah amount
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const stats = [
    { 
      title: ramadhanStatus === 'before' ? 'Menuju Ramadhan' : `Hari ke-${fastingDay} Ramadhan`, 
      value: ramadhanStatus === 'before' ? `${remainingDays} hari lagi` : `${ibadahProgress}%`, 
      icon: '🌙', 
      change: ramadhanStatus === 'before' ? 'Bersiap-siap' : `${remainingDays} hari menuju Idul Fitri`,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      title: 'Progress Ibadah', 
      value: `${completedIbadah}/${totalIbadah}`, 
      icon: '🕌', 
      change: `${ibadahProgress}%`,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      title: 'Baca Quran', 
      value: `${quranPages.completed} lembar`, 
      icon: '📖', 
      change: `${quranProgress}% dari 300`,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      title: 'Sedekah', 
      value: formatRupiah(totalSedekah), 
      icon: '🤲', 
      change: `${sedekahCount} kali`,
      color: 'from-yellow-500 to-orange-500'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white"
          >
            Assalamu'alaikum! 👋
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 mt-2"
          >
            Selamat menjalankan ibadah puasa, semoga diberikan kekuatan dan keberkahan
          </motion.p>
        </div>
        <div className="hidden lg:block">
          <span className="text-7xl">🌙</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="ramadhan-card relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`}></div>
            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {stat.change}
                  </p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quote Islami */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="ramadhan-card ramadhan-gradient text-white"
      >
        <div className="flex items-start space-x-4">
          <span className="text-6xl opacity-50">"</span>
          <div className="flex-1">
            <p className="text-2xl font-arabic text-center mb-4">
              {quote.text}
            </p>
            <p className="text-center text-white/80">
              — {quote.source}
            </p>
          </div>
          <span className="text-6xl opacity-50 self-end">"</span>
        </div>
      </motion.div>

      {/* Jadwal Sholat, Tasbih Digital, dan Doa Harian */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div id="jadwal" className="lg:col-span-1">
          <JadwalSholat />
        </div>
        <div id="tasbih" className="lg:col-span-1">
          <TasbihDigital />
        </div>
        <div id="doa" className="lg:col-span-1">
          <DoaHarian />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard 
            icon="📖" 
            title="Baca Quran" 
            action="Mulai membaca"
            color="from-emerald-500 to-teal-500"
            onClick={() => setActivePage('quran')}
          />
          <QuickActionCard 
            icon="💰" 
            title="Sedekah" 
            action="Catat sedekah"
            color="from-yellow-500 to-amber-500"
            onClick={() => setActivePage('sedekah')}
          />
          <QuickActionCard 
            icon="📿" 
            title="Dzikir" 
            action="Tasbih digital"
            color="from-purple-500 to-indigo-500"
            onClick={() => document.querySelector('#tasbih')?.scrollIntoView({ behavior: 'smooth' })}
          />
          <QuickActionCard 
            icon="🤲" 
            title="Doa" 
            action="Doa harian"
            color="from-pink-500 to-rose-500"
            onClick={() => document.querySelector('#doa')?.scrollIntoView({ behavior: 'smooth' })}
          />
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ icon, title, action, color, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="ramadhan-card text-left relative overflow-hidden group cursor-pointer"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
      <span className="text-3xl mb-3 block">{icon}</span>
      <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">{action}</p>
    </motion.button>
  );
}