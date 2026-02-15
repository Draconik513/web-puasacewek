import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  CalendarIcon, 
  BookOpenIcon, 
  CurrencyDollarIcon,
  TrophyIcon 
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import useLocalStorage from '../hooks/useLocalStorage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Statistik() {
  const [ibadahList] = useLocalStorage('ibadahList', []);
  const [quranPages] = useLocalStorage('quranPages', { completed: 0 });
  const [refleksi] = useLocalStorage('refleksi', []);
  const [sedekahList] = useLocalStorage('sedekahList', []);
  const [weeklyProgress] = useLocalStorage('weeklyProgress', []);
  const [haidHistory] = useLocalStorage('haidHistory', []);

  // Hitung puasa bolong otomatis dari ibadah puasa dan hari haid
  const puasaIbadah = ibadahList.find(i => i.name === 'Puasa');
  const ramadhanStart = new Date(2026, 1, 18);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysElapsed = today >= ramadhanStart ? Math.floor((today - ramadhanStart) / (1000 * 60 * 60 * 24)) + 1 : 0;
  
  // Hitung hari haid selama Ramadhan
  const haidDays = haidHistory?.filter(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entry.isHaid && entryDate >= ramadhanStart && entryDate <= today;
  }).length || 0;
  
  const fastingBreaks = puasaIbadah?.completed ? 0 : (daysElapsed > 0 ? 1 : 0);
  const totalFastingBreaks = fastingBreaks + haidDays;
  const fastingConsistency = daysElapsed > 0 ? Math.round(((daysElapsed - totalFastingBreaks) / daysElapsed) * 100) : 0;

  // Cari hari paling produktif dari weeklyProgress
  const hariProduktif = weeklyProgress[0]?.days
    ? weeklyProgress[0].days.reduce((max, day) => 
        day.progress > (max?.progress || 0) ? day : max
      , null)
    : null;

  const monthlyData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(ramadhanStart);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);
    
    if (date > today) {
      return null;
    }
    
    const dateStr = date.toDateString();
    const dayProgress = weeklyProgress[0]?.days.find(d => 
      new Date(d.date).toDateString() === dateStr
    )?.progress || 0;
    
    return dayProgress;
  });

  const monthlyChartData = {
    labels: Array.from({ length: 30 }, (_, i) => `Hari ${i + 1}`),
    datasets: [
      {
        label: 'Progress Ibadah',
        data: monthlyData,
        backgroundColor: monthlyData.map(val => 
          val === null ? 'rgba(209, 213, 219, 0.3)' :
          val >= 80 ? 'rgba(16, 185, 129, 0.7)' :
          val >= 60 ? 'rgba(34, 197, 94, 0.7)' :
          val >= 40 ? 'rgba(234, 179, 8, 0.7)' :
          'rgba(239, 68, 68, 0.7)'
        ),
        borderColor: monthlyData.map(val => 
          val === null ? '#d1d5db' :
          val >= 80 ? '#10b981' :
          val >= 60 ? '#22c55e' :
          val >= 40 ? '#eab308' :
          '#ef4444'
        ),
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const weeklyChartData = weeklyProgress[0]?.days
    ? {
        labels: weeklyProgress[0].days.map(day => {
          const date = new Date(day.date);
          const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
          return days[date.getDay()];
        }),
        datasets: [
          {
            label: 'Progress Ibadah',
            data: weeklyProgress[0].days.map(day => day.progress),
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22, 163, 74, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#16a34a',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      }
    : {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        datasets: [
          {
            label: 'Progress Ibadah',
            data: [0, 0, 0, 0, 0, 0, 0],
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22, 163, 74, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#16a34a',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f3f4f6',
        bodyColor: '#d1d5db',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: '#6b7280',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        },
      },
    },
  };

  const totalHalamanQuran = quranPages?.completed || 0;
  const totalSedekah = sedekahList?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const totalIbadahSelesai = ibadahList?.filter(i => i.completed).length || 0;

  const stats = [
    {
      title: 'Total Halaman Quran',
      value: totalHalamanQuran,
      icon: <BookOpenIcon className="w-8 h-8" />,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      target: 600
    },
    {
      title: 'Total Sedekah',
      value: `Rp ${totalSedekah.toLocaleString()}`,
      icon: <CurrencyDollarIcon className="w-8 h-8" />,
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      title: 'Ibadah Terselesaikan',
      value: totalIbadahSelesai,
      icon: <ChartBarIcon className="w-8 h-8" />,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Hari Paling Produktif',
      value: hariProduktif ? new Date(hariProduktif.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-',
      subtitle: hariProduktif ? `${hariProduktif.progress}% progress` : 'Belum ada data',
      icon: <TrophyIcon className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          📊 Statistik Ramadhan
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Pantau progress ibadahmu selama bulan Ramadhan
        </p>
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
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}></div>
            <div className="relative">
              <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-4`}>
                <span className={stat.textColor}>{stat.icon}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {stat.value}
              </p>
              {stat.subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {stat.subtitle}
                </p>
              )}
              {stat.target && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-semibold text-primary-600">
                      {((stat.value / stat.target) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(stat.value / stat.target) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`bg-gradient-to-r ${stat.color} h-1.5 rounded-full`}
                    ></motion.div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Grafik Mingguan dan Bulanan */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Grafik Mingguan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="ramadhan-card"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                📈 Grafik Progress Mingguan
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Performa ibadah 7 hari terakhir
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Minggu ini
              </span>
            </div>
          </div>
          
          <div className="h-80">
            <Line data={weeklyChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Grafik Bulanan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="ramadhan-card"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                📊 Grafik Progress Bulanan
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Performa ibadah selama Ramadhan
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                30 hari
              </span>
            </div>
          </div>
          
          <div className="h-80">
            <Bar data={monthlyChartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Ringkasan Pencapaian */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="ramadhan-card"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            🏅 Pencapaian Spesial
          </h2>
          <div className="space-y-3">
            <AchievementBadge 
              icon="🌟"
              title="Rajin Ibadah"
              description="Menyelesaikan semua ibadah wajib 7 hari berturut-turut"
              unlocked={totalIbadahSelesai >= 70}
            />
            <AchievementBadge 
              icon="📚"
              title="Pecinta Quran"
              description="Membaca 100 halaman Quran"
              unlocked={totalHalamanQuran >= 100}
            />
            <AchievementBadge 
              icon="🤲"
              title="Dermawan"
              description="Bersedekah 5 kali dalam seminggu"
              unlocked={totalSedekah >= 100000}
            />
            <AchievementBadge 
              icon="🕋"
              title="Ramadhan Productive"
              description="Produktif setiap hari di bulan Ramadhan"
              unlocked={refleksi.length >= 7}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="ramadhan-card"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            ⚡ Statistik Tambahan
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              <span className="text-gray-700 dark:text-gray-300">Rata-rata ibadah/hari</span>
              <span className="font-bold text-primary-600 dark:text-primary-400">
                {(totalIbadahSelesai / (refleksi.length || 1)).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              <span className="text-gray-700 dark:text-gray-300">Total hari refleksi</span>
              <span className="font-bold text-primary-600 dark:text-primary-400">
                {refleksi.length} hari
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              <span className="text-gray-700 dark:text-gray-300">Konsistensi puasa</span>
              <span className="font-bold text-primary-600 dark:text-primary-400">
                {fastingConsistency}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              <span className="text-gray-700 dark:text-gray-300">Puasa bolong / haid</span>
              <span className="font-bold text-red-600 dark:text-red-400">
                {totalFastingBreaks} hari
              </span>
            </div>
            {haidDays > 0 && (
              <div className="flex justify-between items-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl border border-pink-200 dark:border-pink-800">
                <div className="flex-1">
                  <span className="text-pink-700 dark:text-pink-300 block">🌸 Karena haid</span>
                  <span className="text-xs text-pink-600 dark:text-pink-400 mt-1 block">
                    Perlu diganti setelah Ramadhan
                  </span>
                </div>
                <span className="font-bold text-pink-600 dark:text-pink-400">
                  {haidDays} hari
                </span>
              </div>
            )}
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              <span className="text-gray-700 dark:text-gray-300">Target khatam</span>
              <span className="font-bold text-primary-600 dark:text-primary-400">
                {((totalHalamanQuran / 600) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function AchievementBadge({ icon, title, description, unlocked }) {
  return (
    <div className={`flex items-start space-x-3 p-3 rounded-xl transition-all ${
      unlocked 
        ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800'
        : 'bg-gray-50 dark:bg-gray-700/30 opacity-60'
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        unlocked ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-200 dark:bg-gray-700'
      }`}>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="flex-1">
        <p className={`font-medium ${
          unlocked ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {title}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
      {unlocked && (
        <span className="text-yellow-500">✓</span>
      )}
    </div>
  );
}
