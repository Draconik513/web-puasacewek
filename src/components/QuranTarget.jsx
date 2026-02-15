import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useLocalStorage from '../hooks/useLocalStorage';
import { BookOpenIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function QuranTarget() {
  const [targetPages, setTargetPages] = useLocalStorage('quranPages', {
    perDay: 10,
    perPrayer: 2,
    completed: 0,
    target: 300
  });
  
  const safeTargetPages = {
    perDay: targetPages?.perDay || 10,
    perPrayer: targetPages?.perPrayer || 2,
    completed: targetPages?.completed || 0,
    target: targetPages?.target || 300
  };
  
  const [dailyQuranRead, setDailyQuranRead] = useLocalStorage('dailyQuranRead', {});
  const [ibadahList, setIbadahList] = useLocalStorage('ibadahList', []);

  const today = new Date().toDateString();
  const todayRead = dailyQuranRead[today] || 0;
  const prayerTimes = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];

  const addPages = (pages) => {
    // Cek jika sudah mencapai target maksimal
    if (safeTargetPages.completed >= safeTargetPages.target) {
      alert('Alhamdulillah! Anda sudah menyelesaikan 30 Juz (300 lembar) 🎉');
      return;
    }

    const previousTodayRead = todayRead;
    const newCompleted = Math.min(safeTargetPages.completed + pages, safeTargetPages.target);
    const newTodayRead = todayRead + pages;
    
    setTargetPages({
      ...safeTargetPages,
      completed: newCompleted
    });
    
    setDailyQuranRead({
      ...dailyQuranRead,
      [today]: newTodayRead
    });
    
    // Auto-centang Baca Quran di Ibadah Tracker jika sudah 1 juz (10 lembar)
    if (newTodayRead >= 10) {
      setIbadahList(prev => prev.map(item => 
        item.name === 'Baca Quran' ? { ...item, completed: true } : item
      ));
    }

    // Notifikasi setiap kali menyelesaikan kelipatan 1 juz (10 lembar)
    const previousJuz = Math.floor(previousTodayRead / 10);
    const newJuz = Math.floor(newTodayRead / 10);
    
    if (newJuz > previousJuz) {
      setTimeout(() => {
        if (newJuz === 1) {
          alert('🎉 Alhamdulillah! Selamat, Anda telah menyelesaikan 1 Juz hari ini! 📖✨');
        } else {
          alert(`🎉 Masha Allah! Anda telah menyelesaikan ${newJuz} Juz hari ini! 📖✨🔥`);
        }
      }, 300);
    }

    // Notifikasi jika sudah khatam
    if (newCompleted >= targetPages.target) {
      setTimeout(() => {
        alert('🎉 Masha Allah! Anda telah menyelesaikan Khatam 30 Juz Al-Quran! 🤲');
      }, 300);
    }
  };

  const resetProgress = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset semua pencapaian?')) {
      setTargetPages({
        perDay: 10,
        perPrayer: 2,
        completed: 0,
        target: 300
      });
      setDailyQuranRead({});
    }
  };

  const progress = (safeTargetPages.completed / safeTargetPages.target) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            📖 Target Khatam Quran
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            1 Juz/hari • Cukup 10 lembar setiap selesai sholat
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetProgress}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          🔄 Reset
        </motion.button>
      </div>

      {/* Main Progress Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="ramadhan-card bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative overflow-hidden"
      >
        {/* Fire Animation - Only show when progress >= 50 */}
        {progress >= 50 && (
          <>
            {/* Bottom Fires */}
            <motion.div
              className="absolute -bottom-4 left-[15%] w-12 h-24 bg-gradient-to-t from-yellow-400 via-green-400 to-transparent rounded-full blur-md"
              animate={{
                y: [-15, -45, -15],
                x: [-8, 8, -8],
                scale: [1, 1.4, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-4 right-[15%] w-9 h-18 bg-gradient-to-t from-yellow-300 via-green-300 to-transparent rounded-full blur-md"
              animate={{
                y: [-10, -35, -10],
                x: [5, -5, 5],
                scale: [1, 1.25, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
            />

            {/* Top Fires */}
            <motion.div
              className="absolute -top-4 left-[20%] w-10 h-20 bg-gradient-to-b from-yellow-400 via-green-400 to-transparent rounded-full blur-md rotate-180"
              animate={{
                y: [15, 45, 15],
                x: [-6, 6, -6],
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.div
              className="absolute -top-4 right-[25%] w-8 h-16 bg-gradient-to-b from-yellow-300 via-green-300 to-transparent rounded-full blur-md rotate-180"
              animate={{
                y: [12, 38, 12],
                x: [5, -5, 5],
                scale: [1, 1.25, 1],
                opacity: [0.45, 0.75, 0.45]
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />

            {/* Left Side Fires */}
            <motion.div
              className="absolute -left-3 top-[30%] w-10 h-20 bg-gradient-to-r from-yellow-400 via-green-400 to-transparent rounded-full blur-md -rotate-90"
              animate={{
                x: [15, 45, 15],
                y: [-6, 6, -6],
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
            <motion.div
              className="absolute -left-3 top-[60%] w-8 h-16 bg-gradient-to-r from-yellow-300 via-green-300 to-transparent rounded-full blur-md -rotate-90"
              animate={{
                x: [12, 38, 12],
                y: [5, -5, 5],
                scale: [1, 1.25, 1],
                opacity: [0.45, 0.75, 0.45]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />

            {/* Right Side Fires */}
            <motion.div
              className="absolute -right-3 top-[25%] w-9 h-18 bg-gradient-to-l from-yellow-400 via-green-400 to-transparent rounded-full blur-md rotate-90"
              animate={{
                x: [-15, -42, -15],
                y: [-5, 5, -5],
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
            <motion.div
              className="absolute -right-3 top-[55%] w-7 h-14 bg-gradient-to-l from-yellow-300 via-green-300 to-transparent rounded-full blur-md rotate-90"
              animate={{
                x: [-12, -35, -12],
                y: [4, -4, 4],
                scale: [1, 1.25, 1],
                opacity: [0.45, 0.75, 0.45]
              }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            />

            {/* Middle Bright Fires */}
            <motion.div
              className="absolute bottom-1/4 left-1/4 w-10 h-20 bg-gradient-to-t from-green-500 via-emerald-400 to-transparent rounded-full blur-sm"
              animate={{
                y: [-20, -50, -20],
                x: [-6, 6, -6],
                scale: [1, 1.3, 1],
                opacity: [0.6, 0.95, 0.6]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
            />
            <motion.div
              className="absolute top-1/3 right-1/4 w-9 h-18 bg-gradient-to-t from-green-500 via-emerald-400 to-transparent rounded-full blur-sm"
              animate={{
                y: [-18, -45, -18],
                x: [6, -6, 6],
                scale: [1, 1.25, 1],
                opacity: [0.55, 0.85, 0.55]
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />

            {/* Sparks everywhere */}
            <motion.div
              className="absolute bottom-[20%] left-[30%] w-2 h-2 bg-yellow-300 rounded-full blur-[1px]"
              animate={{
                y: [0, -70, -70],
                x: [-10, 10, 15],
                opacity: [1, 0.8, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            />
            <motion.div
              className="absolute top-[30%] right-[35%] w-2 h-2 bg-green-300 rounded-full blur-[1px]"
              animate={{
                y: [0, -80, -80],
                x: [0, -5, -10],
                opacity: [1, 0.9, 0]
              }}
              transition={{ duration: 2.3, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
            />
            <motion.div
              className="absolute top-[50%] left-[40%] w-2 h-2 bg-emerald-300 rounded-full blur-[1px]"
              animate={{
                y: [0, -75, -75],
                x: [10, -10, -15],
                opacity: [1, 0.85, 0]
              }}
              transition={{ duration: 2.1, repeat: Infinity, ease: "easeOut", delay: 1.1 }}
            />

            {/* Glow Effects */}
            <motion.div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-8 bg-green-400/30 rounded-full blur-xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -top-6 left-1/3 w-24 h-6 bg-green-400/25 rounded-full blur-xl"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.25, 0.5, 0.25]
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
            <motion.div
              className="absolute top-1/2 -left-4 w-20 h-5 bg-green-400/25 rounded-full blur-xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.25, 0.5, 0.25]
              }}
              transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.div
              className="absolute top-1/2 -right-4 w-20 h-5 bg-green-400/25 rounded-full blur-xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.25, 0.5, 0.25]
              }}
              transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
            />
          </>
        )}

        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-sm opacity-90">Progress Khatam Quran</p>
            <p className="text-5xl font-bold mt-2">{safeTargetPages.completed}</p>
            <p className="text-sm opacity-90 mt-1">dari {safeTargetPages.target} lembar</p>
            {progress >= 50 && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold mt-2 bg-white/20 px-3 py-1 rounded-full w-fit"
              >
                🔥 ON FIRE!
              </motion.p>
            )}
          </div>
          <div className="text-7xl opacity-30">📚</div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-4">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
              className="bg-white h-4 rounded-full"
            ></motion.div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-xs opacity-90">Sisa Lembar</p>
            <p className="text-2xl font-bold">{safeTargetPages.target - safeTargetPages.completed}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-xs opacity-90">Juz Tersisa</p>
            <p className="text-2xl font-bold">
              {Math.ceil((safeTargetPages.target - safeTargetPages.completed) / 10)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Today's Reading Strategy */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="ramadhan-card">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            🎯 Strategi Khatam
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Target: 1 Juz/hari (10 lembar)
            </p>
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
              <p className="font-semibold text-primary-700 dark:text-primary-400 mb-2">
                5 Waktu Sholat • 10 Lembar
              </p>
              <div className="space-y-2">
                {prayerTimes.map((prayer, index) => (
                  <div key={prayer} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Setelah Sholat {prayer}
                    </span>
                    <span className="text-sm font-semibold text-primary-600">
                      {safeTargetPages.perPrayer} lembar
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="ramadhan-card">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            📝 Catat Bacaan Hari Ini
          </h2>
          <div className="space-y-4">
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Hari ini kamu telah membaca
              </p>
              <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                {todayRead}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                lembar
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {prayerTimes.map((prayer, index) => (
                <motion.button
                  key={prayer}
                  whileHover={{ scale: safeTargetPages.completed >= safeTargetPages.target ? 1 : 1.05 }}
                  whileTap={{ scale: safeTargetPages.completed >= safeTargetPages.target ? 1 : 0.95 }}
                  onClick={() => addPages(safeTargetPages.perPrayer)}
                  disabled={safeTargetPages.completed >= safeTargetPages.target}
                  className={`p-3 rounded-lg text-center transition-all ${
                    safeTargetPages.completed >= safeTargetPages.target
                      ? 'bg-gray-200 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                      : 'bg-gray-50 dark:bg-gray-700/30 hover:bg-primary-50 dark:hover:bg-primary-900/30'
                  }`}
                >
                  <span className="text-xl mb-1 block">📖</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{prayer}</span>
                  <span className="text-xs font-semibold text-primary-600 block mt-1">
                    +{safeTargetPages.perPrayer}
                  </span>
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: safeTargetPages.completed >= safeTargetPages.target ? 1 : 1.02 }}
              whileTap={{ scale: safeTargetPages.completed >= safeTargetPages.target ? 1 : 0.98 }}
              onClick={() => addPages(safeTargetPages.perDay)}
              disabled={safeTargetPages.completed >= safeTargetPages.target}
              className={`w-full mt-2 ${
                safeTargetPages.completed >= safeTargetPages.target
                  ? 'bg-gray-400 cursor-not-allowed opacity-50'
                  : 'btn-primary'
              }`}
            >
              {safeTargetPages.completed >= safeTargetPages.target ? '✅ Khatam Selesai' : 'Selesai Baca 1 Juz'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Achievement */}
      <div className="ramadhan-card">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          🏆 Pencapaian
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AchievementCard 
            icon="📖" 
            title="Juz 1-5" 
            unlocked={safeTargetPages.completed >= 50}
          />
          <AchievementCard 
            icon="📚" 
            title="Juz 6-10" 
            unlocked={safeTargetPages.completed >= 100}
          />
          <AchievementCard 
            icon="🕋" 
            title="Juz 11-20" 
            unlocked={safeTargetPages.completed >= 200}
          />
          <AchievementCard 
            icon="🤲" 
            title="Khatam 30 Juz" 
            unlocked={safeTargetPages.completed >= 300}
          />
        </div>
      </div>
    </div>
  );
}

function AchievementCard({ icon, title, unlocked }) {
  return (
    <div className={`p-4 rounded-xl text-center transition-all ${
      unlocked 
        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
        : 'bg-gray-50 dark:bg-gray-700/30 opacity-50'
    }`}>
      <span className="text-3xl mb-2 block">{icon}</span>
      <p className="text-sm font-medium text-gray-800 dark:text-white">{title}</p>
      {unlocked && (
        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto mt-2" />
      )}
    </div>
  );
}