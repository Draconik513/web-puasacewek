import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useLocalStorage from '../hooks/useLocalStorage';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function LailatulQadar() {
  const [lailatulQadarData, setLailatulQadarData] = useLocalStorage('lailatulQadarData', {});
  const [quranPages] = useLocalStorage('quranPages', { completed: 0, target: 300 });
  const [splashPositions, setSplashPositions] = useState([]);
  const [quranStatus, setQuranStatus] = useState({});

  const lailatulQadarDates = [
    { ramadhan: 21, date: new Date(2026, 2, 10), night: 'Malam 21 Ramadhan', ganjil: true },
    { ramadhan: 22, date: new Date(2026, 2, 11), night: 'Malam 22 Ramadhan', ganjil: false },
    { ramadhan: 23, date: new Date(2026, 2, 12), night: 'Malam 23 Ramadhan', ganjil: true },
    { ramadhan: 24, date: new Date(2026, 2, 13), night: 'Malam 24 Ramadhan', ganjil: false },
    { ramadhan: 25, date: new Date(2026, 2, 14), night: 'Malam 25 Ramadhan', ganjil: true },
    { ramadhan: 26, date: new Date(2026, 2, 15), night: 'Malam 26 Ramadhan', ganjil: false },
    { ramadhan: 27, date: new Date(2026, 2, 16), night: 'Malam 27 Ramadhan', ganjil: true },
    { ramadhan: 28, date: new Date(2026, 2, 17), night: 'Malam 28 Ramadhan', ganjil: false },
    { ramadhan: 29, date: new Date(2026, 2, 18), night: 'Malam 29 Ramadhan', ganjil: true },
    { ramadhan: 30, date: new Date(2026, 2, 19), night: 'Malam 30 Ramadhan', ganjil: false },
  ];

  const ibadahList = [
    { name: 'Puasa', icon: '🌙' },
    { name: 'Sholat Lima Waktu', icon: '🕌' },
    { name: 'Sholat Tarawih', icon: '✨' },
    { name: 'Baca Quran 1 Juz', icon: '📖' },
  ];

  useEffect(() => {
    const checkQuranStatus = () => {
      const today = new Date().toDateString();
      const dailyQuranRead = JSON.parse(localStorage.getItem('dailyQuranRead') || '{}');
      setQuranStatus(prev => ({
        ...prev,
        [today]: (dailyQuranRead[today] || 0) >= 10
      }));
    };

    checkQuranStatus();
    const interval = setInterval(checkQuranStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setSplashPositions(Array.from({ length: 12 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: Math.random() * 0.4 + 0.6,
      size: Math.random() * 8 + 4,
    })));
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const today = new Date().toDateString();
      const dailyQuranRead = JSON.parse(localStorage.getItem('dailyQuranRead') || '{}');
      setQuranStatus(prev => ({
        ...prev,
        [today]: (dailyQuranRead[today] || 0) >= 10
      }));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const calculateDayProgress = (date) => {
    const firstQadarDate = new Date(2026, 2, 10); // 10 Maret 2026
    firstQadarDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (today < firstQadarDate) return 0;
    
    const dateStr = date.toDateString();
    const dayData = lailatulQadarData[dateStr];
    if (!dayData) return 0;
    
    const completed = ibadahList.filter(ibadah => {
      if (ibadah.name === 'Baca Quran 1 Juz') {
        return dayData[ibadah.name] && quranStatus[dateStr];
      }
      return dayData[ibadah.name];
    }).length;
    return Math.round((completed / ibadahList.length) * 100);
  };

  const totalQadarPercentage = Math.round(
    lailatulQadarDates.reduce((sum, item) => sum + calculateDayProgress(item.date), 0) / lailatulQadarDates.length
  ) || 0;

  const isAllNightsPerfect = totalQadarPercentage === 100 && Object.keys(lailatulQadarData).length > 0;

  const canCheckQuran = (date) => {
    const dateStr = date.toDateString();
    return quranStatus[dateStr] || false;
  };

  const isDateAvailable = (date) => {
    const firstQadarDate = new Date(2026, 2, 10); // 10 Maret 2026
    firstQadarDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return today >= firstQadarDate && checkDate <= today;
  };

  const SplashEffect = () => (
    <>
      {splashPositions.map((pos, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -80, -120],
            x: [0, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 100],
            opacity: [1, 0.8, 0],
            scale: [1, 0.8, 0.3]
          }}
          transition={{ 
            duration: pos.duration, 
            repeat: Infinity, 
            ease: "easeOut", 
            delay: pos.delay 
          }}
          style={{ 
            left: `${pos.left}%`,
            top: `${pos.top}%`
          }}
          className={`absolute w-${Math.floor(pos.size)} h-${Math.floor(pos.size)} bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-sm`}
        />
      ))}
    </>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          ✨ Lailatul Qadar
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Malam yang lebih baik dari 1000 bulan - Kejar ibadahmu di 10 hari terakhir Ramadhan
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="ramadhan-card bg-gradient-to-br from-purple-600 to-pink-600 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16"></div>
        </div>
        
        <div className="relative z-10">
          <div className="text-center mb-6">
            <p className="text-sm opacity-90 mb-2">Pencapaian Lailatul Qadar</p>
            <p className="text-5xl font-bold">{totalQadarPercentage}%</p>
            <p className="text-sm opacity-90 mt-2">Dari 1000 bulan ibadah</p>
          </div>

          <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalQadarPercentage}%` }}
              transition={{ duration: 1 }}
              className="bg-gradient-to-r from-yellow-300 to-yellow-100 h-4 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {isAllNightsPerfect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ramadhan-card bg-gradient-to-br from-purple-600 to-pink-600 text-white relative overflow-hidden"
        >
          <SplashEffect />
          
          <div className="relative z-10 text-center">
            <motion.p 
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="text-6xl mb-3"
            >
              🏆
            </motion.p>
            <p className="text-3xl font-bold mb-2">PENCAPAIAN LAILATUL QADAR!</p>
            <p className="text-base opacity-95">Anda telah berhasil menyelesaikan semua 10 malam terakhir Ramadhan dengan SEMPURNA!</p>
            <p className="text-sm opacity-85 mt-4">✨ Semoga ibadahmu diterima dan mendapat berkah Lailatul Qadar 🤲</p>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          📅 10 Hari Terakhir Ramadhan
        </h2>
        
        {lailatulQadarDates.map((item, index) => {
          const progress = calculateDayProgress(item.date);
          const dayData = lailatulQadarData[item.date.toDateString()] || {};
          const quranDisabled = !canCheckQuran(item.date);
          const dateAvailable = isDateAvailable(item.date);
          
          return (
            <div key={item.ramadhan}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`ramadhan-card relative overflow-hidden ${
                  item.ganjil ? 'border-2 border-yellow-400 dark:border-yellow-500' : ''
                } ${
                  !dateAvailable ? 'opacity-85 pointer-events-none' : ''
                }`}
              >
                {item.ganjil && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                    🌟 Malam Ganjil
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {item.night}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {format(item.date, 'EEEE, dd MMMM yyyy', { locale: id })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {progress}%
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {ibadahList.map((ibadah) => (
                    <label 
                      key={ibadah.name}
                      className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                        ibadah.name === 'Baca Quran 1 Juz' && quranDisabled
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={dayData[ibadah.name] || false}
                        onChange={(e) => {
                          if (!dateAvailable || (ibadah.name === 'Baca Quran 1 Juz' && quranDisabled)) return;
                          const dateStr = item.date.toDateString();
                          setLailatulQadarData({
                            ...lailatulQadarData,
                            [dateStr]: { ...dayData, [ibadah.name]: e.target.checked }
                          });
                        }}
                        disabled={!dateAvailable || (ibadah.name === 'Baca Quran 1 Juz' && quranDisabled)}
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {ibadah.icon} {ibadah.name}
                      </span>
                    </label>
                  ))}
                </div>

                {quranDisabled && dateAvailable && (
                  <p className="text-xs text-red-500 mt-2">
                    ⚠️ Selesaikan 1 juz di Target Quran terlebih dahulu
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-2 rounded-full ${
                        progress === 100 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                        progress >= 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                        'bg-gradient-to-r from-red-400 to-pink-500'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>

              {!dateAvailable && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                  ⏳ Akan Datang - Terbuka pada {format(item.date, 'EEEE', { locale: id })}, {format(item.date, 'dd MMMM yyyy', { locale: id })}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="ramadhan-card bg-gradient-to-br from-blue-600 to-cyan-600 text-white"
      >
        <div className="flex items-start space-x-4">
          <span className="text-4xl">💫</span>
          <div>
            <p className="font-semibold mb-2">Keutamaan Lailatul Qadar</p>
            <p className="text-sm opacity-90">
              "Sesungguhnya Kami telah menurunkannya (Al-Quran) pada malam Qadar. Dan tahukah kamu apakah malam Qadar itu? Malam Qadar lebih baik daripada seribu bulan."
            </p>
            <p className="text-xs opacity-75 mt-2">— QS. Al-Qadr: 1-3</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
