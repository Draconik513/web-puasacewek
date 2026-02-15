import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useLocalStorage from '../hooks/useLocalStorage';
import { PlusIcon, CheckIcon, TrashIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks } from 'date-fns';
import { id } from 'date-fns/locale';

export default function IbadahTracker() {
  const [customIbadah, setCustomIbadah] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [menuBukaChecked, setMenuBukaChecked] = useLocalStorage('menuBukaChecked', {});
  
  const [ibadahList, setIbadahList] = useLocalStorage('ibadahList', []);
  const [isHaid, setIsHaid] = useLocalStorage('isHaid', false);
  const [haidHistory, setHaidHistory] = useLocalStorage('haidHistory', []);

  // Update haid history setiap kali isHaid berubah
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();
    
    setHaidHistory(prev => {
      const filtered = prev.filter(entry => entry.date !== todayStr);
      return [...filtered, { date: todayStr, isHaid }];
    });
    
    // Auto-add "Membantu Siapkan Menu Buka" saat haid aktif
    if (isHaid) {
      const menuBukaExists = ibadahList.some(i => i.id === 'menu-buka-haid');
      if (!menuBukaExists) {
        setIbadahList(prev => [
          ...prev,
          {
            id: 'menu-buka-haid',
            name: 'Membantu Siapkan Menu Buka',
            completed: menuBukaChecked[new Date().toDateString()] || false,
            wajib: false,
            category: 'custom',
            custom: false,
            haidOnly: true,
            points: 10
          }
        ]);
      }
    } else {
      // Remove menu buka saat haid nonaktif
      setIbadahList(prev => prev.filter(i => i.id !== 'menu-buka-haid'));
    }
  }, [isHaid]);

  const defaultIbadahList = [
    { id: 1, name: 'Sholat Subuh', completed: false, wajib: true, category: 'sholat', time: '04:30', points: 6 },
    { id: 2, name: 'Sholat Dzuhur', completed: false, wajib: true, category: 'sholat', time: '12:00', points: 6 },
    { id: 3, name: 'Sholat Ashar', completed: false, wajib: true, category: 'sholat', time: '15:30', points: 6 },
    { id: 4, name: 'Sholat Maghrib', completed: false, wajib: true, category: 'sholat', time: '18:00', points: 6 },
    { id: 5, name: 'Sholat Isya', completed: false, wajib: true, category: 'sholat', time: '19:30', points: 6 },
    { id: 6, name: 'Puasa', completed: false, wajib: true, category: 'puasa', points: 20 },
    { id: 7, name: 'Sholat Tahajud', completed: false, wajib: false, category: 'sholat-sunnah', time: '03:00', points: 5 },
    { id: 8, name: 'Sholat Tarawih', completed: false, wajib: false, category: 'sholat-sunnah', time: '20:00', points: 5 },
    { id: 9, name: 'Sholat Witir', completed: false, wajib: false, category: 'sholat-sunnah', time: '21:00', points: 5 },
    { id: 10, name: 'Baca Quran', completed: false, wajib: false, category: 'quran', target: '10 lembar', points: 10 },
    { id: 11, name: 'Dzikir Pagi', completed: false, wajib: false, category: 'dzikir', points: 5 },
    { id: 12, name: 'Dzikir Petang', completed: false, wajib: false, category: 'dzikir', points: 5 },
    { id: 13, name: 'Sedekah', completed: false, wajib: false, category: 'sedekah', points: 15 },
  ];

  useEffect(() => {
    if (!ibadahList || ibadahList.length === 0) {
      setIbadahList(defaultIbadahList);
    }
  }, []);

  const [weeklyProgress, setWeeklyProgress] = useLocalStorage('weeklyProgress', []);
  const [todayIbadah, setTodayIbadah] = useLocalStorage('todayIbadah', {});



  useEffect(() => {
    if (!weeklyProgress || weeklyProgress.length === 0) {
      const ramadhanStart = new Date(2026, 1, 18); // 18 Feb 2026
      const weekStart = new Date(ramadhanStart);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const days = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        days.push({
          date: day.toISOString(),
          progress: 0,
        });
      }
      
      setWeeklyProgress([{
        id: 'current-week',
        startDate: weekStart.toISOString(),
        endDate: weekEnd.toISOString(),
        days: days
      }]);
    }
  }, []);

  // Get current week data
  const currentWeekData = weeklyProgress[0];
  
  // Format tanggal range
  const weekStartDate = currentWeekData ? new Date(currentWeekData.startDate) : new Date();
  const weekEndDate = currentWeekData ? new Date(currentWeekData.endDate) : new Date();
  
  const weekRangeText = `${format(weekStartDate, 'dd MMMM yyyy', { locale: id })} - ${format(weekEndDate, 'dd MMMM yyyy', { locale: id })}`;

  const categories = [
    { id: 'all', name: 'Semua', icon: '📋' },
    { id: 'sholat', name: 'Sholat Wajib', icon: '🕌' },
    { id: 'sholat-sunnah', name: 'Sholat Sunnah', icon: '🕋' },
    { id: 'quran', name: 'Quran', icon: '📖' },
    { id: 'dzikir', name: 'Dzikir', icon: '📿' },
    { id: 'sedekah', name: 'Sedekah', icon: '💵' },
    { id: 'custom', name: 'Custom', icon: '✨' },
  ];

  const toggleIbadah = (id) => {
    const ibadah = ibadahList.find(i => i.id === id);
    
    // Cek jika sedang haid dan ibadah adalah shalat (wajib & sunnah) atau puasa
    if (isHaid && (ibadah?.category === 'sholat' || ibadah?.category === 'sholat-sunnah' || ibadah?.name === 'Puasa')) {
      return; // Tidak bisa toggle saat haid
    }
    
    // Save menu buka checked state
    if (id === 'menu-buka-haid') {
      const today = new Date().toDateString();
      setMenuBukaChecked(prev => ({
        ...prev,
        [today]: !ibadah?.completed
      }));
    }
    
    const dailyQuranRead = JSON.parse(localStorage.getItem('dailyQuranRead') || '{}');
    const today = new Date().toDateString();
    const todayRead = dailyQuranRead[today] || 0;
    
    // Cek jika Baca Quran dan belum 1 juz - SKIP validasi jika sedang haid
    if (!isHaid && ibadah?.name === 'Baca Quran' && !ibadah.completed && todayRead < 10) {
      alert('Anda harus membaca minimal 1 juz (10 lembar) di halaman Target Khatam terlebih dahulu!');
      return;
    }
    
    setIbadahList(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      
      // Update progress dengan data terbaru
      setTimeout(() => {
        // Jika sedang haid, exclude shalat (wajib & sunnah) dan puasa dari perhitungan
        const relevantIbadah = isHaid 
          ? updated.filter(i => i.category !== 'sholat' && i.category !== 'sholat-sunnah' && i.name !== 'Puasa')
          : updated;
        
        const completedPoints = relevantIbadah.filter(i => i.completed).reduce((sum, i) => sum + (i.points || 0), 0);
        const totalPoints = relevantIbadah.reduce((sum, i) => sum + (i.points || 0), 0);
        const progress = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

        setWeeklyProgress(prevWeek => {
          const newProgress = [...prevWeek];
          if (newProgress[0]) {
            const todayIndex = newProgress[0].days.findIndex(d => 
              new Date(d.date).toDateString() === new Date().toDateString()
            );
            if (todayIndex !== -1) {
              newProgress[0].days[todayIndex].progress = progress;
            }
          }
          return newProgress;
        });
      }, 50);
      
      return updated;
    });
    
    setTodayIbadah({
      ...todayIbadah,
      [id]: !ibadah?.completed
    });
  };

  const updateTodayProgress = () => {
    const today = new Date().toISOString();
    
    // Jika sedang haid, exclude shalat (wajib & sunnah) dan puasa dari perhitungan
    const relevantIbadah = isHaid 
      ? ibadahList.filter(i => i.category !== 'sholat' && i.category !== 'sholat-sunnah' && i.name !== 'Puasa')
      : ibadahList;
    
    const completedPoints = relevantIbadah.filter(i => i.completed).reduce((sum, i) => sum + (i.points || 0), 0);
    const totalPoints = relevantIbadah.reduce((sum, i) => sum + (i.points || 0), 0);
    const progress = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

    setWeeklyProgress(prev => {
      const newProgress = [...prev];
      if (newProgress[0]) {
        const todayIndex = newProgress[0].days.findIndex(d => 
          new Date(d.date).toDateString() === new Date().toDateString()
        );
        if (todayIndex !== -1) {
          newProgress[0].days[todayIndex].progress = progress;
        }
      }
      return newProgress;
    });
  };

  const addCustomIbadah = () => {
    if (customIbadah.trim()) {
      const newId = Math.max(...ibadahList.map(i => i.id), 0) + 1;
      setIbadahList([
        ...ibadahList,
        {
          id: newId,
          name: customIbadah,
          completed: false,
          wajib: false,
          category: 'custom',
          custom: true,
          points: 0
        }
      ]);
      setCustomIbadah('');
      setShowAddForm(false);
    }
  };

  const deleteIbadah = (id) => {
    setIbadahList(ibadahList.filter(item => item.id !== id));
  };
  
  const downloadWeeklyReport = () => {
    const reportData = [
      ['LAPORAN PROGRESS IBADAH MINGGUAN'],
      ['Ramadhan Journey 1447 H'],
      [''],
      [`Periode: ${weekRangeText}`],
      [''],
      ['Hari', 'Tanggal', 'Progress', 'Status'],
      ...currentWeekData.days.map(day => {
        const date = new Date(day.date);
        const isFuture = date > new Date();
        return [
          format(date, 'EEEE', { locale: id }),
          format(date, 'dd MMMM yyyy', { locale: id }),
          isFuture ? '-' : `${day.progress}%`,
          isFuture ? 'Akan Datang' : 
            day.progress >= 80 ? 'Baik' :
            day.progress >= 60 ? 'Cukup' :
            day.progress >= 40 ? 'Kurang' : 'Rendah'
        ];
      }),
      [''],
      ['RINGKASAN'],
      ['Rata-rata Progress', `${weekAverage}%`],
      ['Hari Terbaik', `${pastDays.length > 0 ? Math.max(...pastDays.map(d => d.progress)) : 0}%`],
      ['Hari Produktif', `${pastDays.filter(d => d.progress >= 80).length}/${pastDays.length}`],
      ['Perlu Perbaikan', `${pastDays.filter(d => d.progress < 60).length}/${pastDays.length}`]
    ];
    
    const csvContent = reportData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Progress_Ibadah_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredIbadah = activeCategory === 'all' 
    ? ibadahList 
    : ibadahList.filter(item => item.category === activeCategory);

  // Jika sedang haid, exclude shalat (wajib & sunnah) dan puasa dari perhitungan
  const relevantIbadah = isHaid 
    ? ibadahList.filter(i => i.category !== 'sholat' && i.category !== 'sholat-sunnah' && i.name !== 'Puasa')
    : ibadahList;
  
  const completedPoints = relevantIbadah.filter(i => i.completed).reduce((sum, i) => sum + (i.points || 0), 0);
  const totalPoints = relevantIbadah.reduce((sum, i) => sum + (i.points || 0), 0);
  const todayProgress = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  // Calculate week average - hanya dari hari yang sudah lewat
  const pastDays = currentWeekData?.days.filter(day => new Date(day.date) <= new Date()) || [];
  const weekAverage = pastDays.length > 0
    ? Math.round(pastDays.reduce((acc, day) => acc + day.progress, 0) / pastDays.length)
    : 0;

  // Get progress color based on percentage
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-emerald-500';
    if (progress >= 40) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressTextColor = (progress) => {
    if (progress >= 80) return 'text-green-600 dark:text-green-400';
    if (progress >= 60) return 'text-emerald-600 dark:text-emerald-400';
    if (progress >= 40) return 'text-yellow-600 dark:text-yellow-400';
    if (progress >= 20) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            🕌 Ibadah Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Catat dan pantau ibadah harianmu selama Ramadhan
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (window.confirm('Reset semua data ibadah? Data tidak bisa dikembalikan!')) {
              localStorage.removeItem('ibadahList');
              localStorage.removeItem('weeklyProgress');
              localStorage.removeItem('todayIbadah');
              localStorage.removeItem('dailyQuranRead');
              window.location.reload();
            }
          }}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          🔄 Reset Data
        </motion.button>
      </div>

      {/* Mode Haid Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="ramadhan-card bg-pink-50 dark:bg-pink-900/20 border-2 border-pink-200 dark:border-pink-800"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="haidMode"
              checked={isHaid}
              onChange={(e) => setIsHaid(e.target.checked)}
              className="mt-1 w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
            />
            <div>
              <label htmlFor="haidMode" className="font-medium text-pink-800 dark:text-pink-300 cursor-pointer">
                🌸 Saya sedang haid
              </label>
              {isHaid && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 p-3 bg-white dark:bg-pink-900/30 rounded-lg"
                >
                  <p className="text-sm text-pink-700 dark:text-pink-300 leading-relaxed">
                    🌸 <strong>Kamu sedang dalam fase istirahat yang Allah berikan.</strong>
                  </p>
                  <p className="text-xs text-pink-600 dark:text-pink-400 mt-2">
                    Shalat dan puasa otomatis di-nonaktifkan. Tetap bisa isi dzikir, doa, refleksi, dan sedekah. Progress dihitung netral.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="ramadhan-card bg-gradient-to-r from-primary-500 to-primary-600 text-white lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Progress Ibadah Hari Ini</p>
              <p className="text-4xl font-bold mt-2">{completedPoints}/{totalPoints}</p>
              <p className="text-sm opacity-90 mt-2">
                {todayProgress}% Selesai
              </p>
            </div>
            <div className="text-6xl opacity-50">📊</div>
          </div>
          <div className="mt-4 relative">
            <div className="w-full bg-white/30 rounded-full h-3 overflow-visible relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${todayProgress}%` }}
                transition={{ duration: 0.5 }}
                className="bg-white h-3 rounded-full relative overflow-visible"
              >
                {/* Fire effect on progress bar - only if progress > 0 */}
                {todayProgress > 0 && (
                  <>
                    {/* Base Layer - Red/Orange (Hottest) - More solid */}
                    <motion.div
                      className="absolute -right-1.5 -top-4 w-4 h-8 bg-gradient-to-t from-red-600 via-orange-500 to-transparent rounded-full blur-sm"
                      animate={{
                        y: [-3, -15, -3],
                        x: [-2, 2, -2],
                        scale: [1, 1.4, 1],
                        opacity: [0.85, 1, 0.85]
                      }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute -right-1 -top-3 w-3.5 h-7 bg-gradient-to-t from-orange-600 via-red-500 to-transparent rounded-full blur-sm"
                      animate={{
                        y: [-2, -13, -2],
                        x: [1.5, -1.5, 1.5],
                        scale: [1, 1.3, 1],
                        opacity: [0.8, 0.95, 0.8]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    />
                    <motion.div
                      className="absolute -right-2 -top-3 w-3.5 h-6 bg-gradient-to-t from-red-500 via-orange-500 to-transparent rounded-full blur-sm"
                      animate={{
                        y: [-2, -12, -2],
                        x: [-1.5, 1.5, -1.5],
                        scale: [1, 1.3, 1],
                        opacity: [0.8, 0.95, 0.8]
                      }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    />

                    {/* Middle Layer - Orange/Yellow - More solid */}
                    <motion.div
                      className="absolute -right-1 -top-6 w-3.5 h-10 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent rounded-full blur-[2px]"
                      animate={{
                        y: [-5, -20, -5],
                        x: [-3, 3, -3],
                        scale: [1, 1.5, 1],
                        opacity: [0.9, 1, 0.9]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                    />
                    <motion.div
                      className="absolute -right-2 -top-5 w-3 h-9 bg-gradient-to-t from-yellow-500 via-orange-400 to-transparent rounded-full blur-[2px]"
                      animate={{
                        y: [-4, -18, -4],
                        x: [2, -2, 2],
                        scale: [1, 1.4, 1],
                        opacity: [0.85, 1, 0.85]
                      }}
                      transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
                    />
                    <motion.div
                      className="absolute -right-0.5 -top-6 w-3 h-9 bg-gradient-to-t from-orange-600 via-yellow-500 to-transparent rounded-full blur-[2px]"
                      animate={{
                        y: [-5, -19, -5],
                        x: [-1.5, 1.5, -1.5],
                        scale: [1, 1.45, 1],
                        opacity: [0.9, 1, 0.9]
                      }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    />

                    {/* Top Layer - Yellow/White (Tips) - More solid */}
                    <motion.div
                      className="absolute -right-1 -top-8 w-2 h-7 bg-gradient-to-t from-yellow-400 via-yellow-200 to-transparent rounded-full blur-[1px]"
                      animate={{
                        y: [-7, -25, -7],
                        x: [-3, 3, -3],
                        scale: [1, 1.6, 1],
                        opacity: [0.85, 1, 0.85]
                      }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                    />
                    <motion.div
                      className="absolute -right-1.5 -top-7 w-2 h-6 bg-gradient-to-t from-yellow-300 via-yellow-50 to-transparent rounded-full blur-[1px]"
                      animate={{
                        y: [-6, -23, -6],
                        x: [3, -3, 3],
                        scale: [1, 1.5, 1],
                        opacity: [0.9, 1, 0.9]
                      }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    />
                    <motion.div
                      className="absolute -right-2 -top-6 w-1.5 h-6 bg-gradient-to-t from-yellow-400 via-yellow-200 to-transparent rounded-full blur-[1px]"
                      animate={{
                        y: [-5, -22, -5],
                        x: [-2, 2, -2],
                        scale: [1, 1.5, 1],
                        opacity: [0.85, 1, 0.85]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.45 }}
                    />
                    
                    {/* Spark particles - More visible */}
                    <motion.div
                      className="absolute -right-1 -top-2 w-1 h-1 bg-yellow-300 rounded-full blur-[0.3px]"
                      animate={{
                        y: [0, -25, -25],
                        x: [-3, 5, 8],
                        opacity: [1, 0.9, 0],
                        scale: [1, 0.6, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
                    />
                    <motion.div
                      className="absolute -right-1.5 -top-2 w-1 h-1 bg-orange-400 rounded-full blur-[0.3px]"
                      animate={{
                        y: [0, -28, -28],
                        x: [2, -4, -7],
                        opacity: [1, 0.95, 0],
                        scale: [1, 0.6, 0]
                      }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                    />
                    <motion.div
                      className="absolute -right-1 -top-2 w-1 h-1 bg-yellow-400 rounded-full blur-[0.3px]"
                      animate={{
                        y: [0, -27, -27],
                        x: [0, 3, 6],
                        opacity: [1, 0.9, 0],
                        scale: [1, 0.6, 0]
                      }}
                      transition={{ duration: 2.1, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
                    />
                    
                    {/* Glow at base - More intense */}
                    <motion.div
                      className="absolute -right-3 -top-1 w-6 h-4 bg-orange-500/60 rounded-full blur-lg"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute -right-2 -top-0.5 w-4 h-3 bg-red-500/50 rounded-full blur-md"
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.4, 0.7, 0.4]
                      }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    />

                    {/* Heat distortion effect - More visible */}
                    <motion.div
                      className="absolute -right-1.5 -top-9 w-3 h-12 bg-gradient-to-t from-transparent via-orange-300/30 to-transparent rounded-full blur-[2px]"
                      animate={{
                        y: [-3, -10, -3],
                        scaleY: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="ramadhan-card bg-gradient-to-r from-emerald-500 to-teal-600 text-white relative overflow-hidden"
        >
          {/* Fire Animation - Only show when weekAverage >= 80 */}
          {weekAverage >= 80 && (
            <>
              {/* Base Fire Layers - Bottom */}
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
                className="absolute -bottom-4 left-[35%] w-10 h-20 bg-gradient-to-t from-yellow-300 via-green-300 to-transparent rounded-full blur-md"
                animate={{
                  y: [-12, -38, -12],
                  x: [-6, 6, -6],
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
              <motion.div
                className="absolute -bottom-4 right-[35%] w-11 h-22 bg-gradient-to-t from-yellow-400 via-green-400 to-transparent rounded-full blur-md"
                animate={{
                  y: [-14, -42, -14],
                  x: [7, -7, 7],
                  scale: [1, 1.35, 1],
                  opacity: [0.45, 0.75, 0.45]
                }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
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

              {/* Middle Fire Layers - Brighter Green */}
              <motion.div
                className="absolute -bottom-3 left-1/4 w-10 h-20 bg-gradient-to-t from-green-500 via-emerald-400 to-transparent rounded-full blur-sm"
                animate={{
                  y: [-20, -50, -20],
                  x: [-6, 6, -6],
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 0.95, 0.6]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
              />
              <motion.div
                className="absolute -bottom-3 left-1/2 w-12 h-24 bg-gradient-to-t from-green-600 via-emerald-500 to-transparent rounded-full blur-sm"
                animate={{
                  y: [-25, -55, -25],
                  x: [-4, 4, -4],
                  scale: [1, 1.4, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
              <motion.div
                className="absolute -bottom-3 right-1/4 w-9 h-18 bg-gradient-to-t from-green-500 via-emerald-400 to-transparent rounded-full blur-sm"
                animate={{
                  y: [-18, -45, -18],
                  x: [6, -6, 6],
                  scale: [1, 1.25, 1],
                  opacity: [0.55, 0.85, 0.55]
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />

              {/* Top Fire Layers - Light Green Tips */}
              <motion.div
                className="absolute -bottom-2 left-[30%] w-6 h-14 bg-gradient-to-t from-emerald-400 via-green-300 to-transparent rounded-full blur-[2px]"
                animate={{
                  y: [-25, -60, -25],
                  x: [-8, 8, -8],
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.9, 0.5]
                }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
              />
              <motion.div
                className="absolute -bottom-2 left-[45%] w-7 h-16 bg-gradient-to-t from-emerald-500 via-green-400 to-transparent rounded-full blur-[2px]"
                animate={{
                  y: [-28, -65, -28],
                  x: [-5, 5, -5],
                  scale: [1, 1.6, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
              />
              <motion.div
                className="absolute -bottom-2 right-[30%] w-5 h-12 bg-gradient-to-t from-emerald-400 via-green-300 to-transparent rounded-full blur-[2px]"
                animate={{
                  y: [-22, -55, -22],
                  x: [7, -7, 7],
                  scale: [1, 1.45, 1],
                  opacity: [0.5, 0.85, 0.5]
                }}
                transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
              />

              {/* Sparks/Particles */}
              <motion.div
                className="absolute bottom-0 left-[25%] w-2 h-2 bg-yellow-300 rounded-full blur-[1px]"
                animate={{
                  y: [0, -70, -70],
                  x: [-10, 10, 15],
                  opacity: [1, 0.8, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
              />
              <motion.div
                className="absolute bottom-0 left-[50%] w-2 h-2 bg-green-300 rounded-full blur-[1px]"
                animate={{
                  y: [0, -80, -80],
                  x: [0, -5, -10],
                  opacity: [1, 0.9, 0]
                }}
                transition={{ duration: 2.3, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
              />
              <motion.div
                className="absolute bottom-0 right-[25%] w-2 h-2 bg-emerald-300 rounded-full blur-[1px]"
                animate={{
                  y: [0, -75, -75],
                  x: [10, -10, -15],
                  opacity: [1, 0.85, 0]
                }}
                transition={{ duration: 2.1, repeat: Infinity, ease: "easeOut", delay: 1.1 }}
              />

              {/* Glow Effect at Base */}
              <motion.div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-8 bg-green-400/30 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          )}
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm opacity-90">Rata-rata Minggu Ini</p>
              <p className="text-4xl font-bold mt-2">{weekAverage}%</p>
              <p className="text-sm opacity-90 mt-2">
                {pastDays.filter(d => d.progress >= 80).length} hari produktif
              </p>
              {weekAverage >= 80 && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-semibold mt-2 bg-white/20 px-3 py-1 rounded-full w-fit"
                >
                  🔥 ON FIRE!
                </motion.p>
              )}
            </div>
            <div className="text-6xl opacity-50">📈</div>
          </div>
        </motion.div>
      </div>

      {/* Weekly Progress Table - NEW */}
      {currentWeekData && currentWeekData.days.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="ramadhan-card overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                📅 Progress Mingguan
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {weekRangeText}
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadWeeklyReport}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download</span>
          </motion.button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300 w-1/2">
                  📆 Date
                </th>
                <th className="text-left py-4 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  📊 Progress Bar
                </th>
              </tr>
            </thead>
            <tbody>
              {currentWeekData?.days.map((day, index) => {
                const date = new Date(day.date);
                const ramadhanStart = new Date(2026, 1, 18);
                ramadhanStart.setHours(0, 0, 0, 0);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const isFuture = today < ramadhanStart || date > today;
                const isToday = date.toDateString() === today.toDateString() && today >= ramadhanStart;
                const progress = isFuture ? null : day.progress;
                
                return (
                  <motion.tr
                    key={day.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 
                      dark:hover:bg-gray-700/30 transition-colors ${
                      isToday ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    } ${
                      isFuture ? 'opacity-50' : ''
                    }`}
                  >
                    {/* Date */}
                    <td className="py-4 px-2">
                      <div className="flex flex-col">
                        <span className={`font-medium ${
                          isToday 
                            ? 'text-primary-600 dark:text-primary-400' 
                            : isFuture
                            ? 'text-gray-400 dark:text-gray-500'
                            : 'text-gray-800 dark:text-white'
                        }`}>
                          {format(date, 'EEEE', { locale: id })}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(date, 'dd MMMM yyyy', { locale: id })}
                        </span>
                        {isToday && (
                          <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full mt-1 w-fit">
                            Hari Ini
                          </span>
                        )}
                        {isFuture && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full mt-1 w-fit">
                            Akan Datang
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Progress Bar */}
                    <td className="py-4 px-2">
                      {isFuture ? (
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div className="bg-gray-300 dark:bg-gray-600 h-2.5 rounded-full w-0"></div>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 min-w-[50px]">
                            -
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className={`text-sm font-semibold ${getProgressTextColor(progress)}`}>
                                {progress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`${getProgressColor(progress)} h-2.5 rounded-full`}
                              ></motion.div>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[50px]">
                            {progress >= 80 ? '🏆 Baik' : 
                             progress >= 60 ? '✅ Cukup' : 
                             progress >= 40 ? '⚠️ Kurang' : '❗ Rendah'}
                          </span>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer - Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400">Rata-rata</p>
              <p className={`text-xl font-bold ${getProgressTextColor(weekAverage)}`}>
                {weekAverage}%
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400">Hari Terbaik</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {pastDays.length > 0 ? Math.max(...pastDays.map(d => d.progress)) : 0}%
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400">Hari Produktif</p>
              <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                {pastDays.filter(d => d.progress >= 80).length}/{pastDays.length}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400">Perlu Perbaikan</p>
              <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                {pastDays.filter(d => d.progress < 60).length}/{pastDays.length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      )}

      {/* Categories */}
      <div className="flex overflow-x-auto pb-2 space-x-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeCategory === category.id
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </motion.button>
        ))}
      </div>

      {/* Add Custom Ibadah */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Daftar Ibadah
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Tambah Ibadah</span>
        </motion.button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="ramadhan-card bg-gray-50 dark:bg-gray-700/50"
          >
            <div className="flex space-x-3">
              <input
                type="text"
                value={customIbadah}
                onChange={(e) => setCustomIbadah(e.target.value)}
                placeholder="Nama ibadah (contoh: Tahajud, Dhuha, dll)"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addCustomIbadah}
                className="btn-primary"
              >
                Simpan
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ibadah List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredIbadah.map((ibadah, index) => (
            <motion.div
              key={ibadah.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
              className={`ramadhan-card flex items-center justify-between ${
                ibadah.completed ? 'bg-green-50 dark:bg-green-900/20' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                {isHaid && (ibadah.category === 'sholat' || ibadah.category === 'sholat-sunnah' || ibadah.name === 'Puasa') ? (
                  <div className="w-7 h-7 rounded-full border-2 border-pink-300 dark:border-pink-700 bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                    <span className="text-xs">🌸</span>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleIbadah(ibadah.id)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center
                      ${ibadah.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : ibadah.haidOnly
                        ? 'border-pink-400 dark:border-pink-500'
                        : 'border-gray-300 dark:border-gray-600'
                      }`}
                  >
                    {ibadah.completed && <CheckIcon className="w-4 h-4" />}
                  </motion.button>
                )}
                <div>
                  <p className={`font-medium ${
                    ibadah.completed 
                      ? 'text-gray-500 line-through dark:text-gray-400' 
                      : isHaid && (ibadah.category === 'sholat' || ibadah.category === 'sholat-sunnah' || ibadah.name === 'Puasa')
                      ? 'text-pink-400 dark:text-pink-500'
                      : ibadah.haidOnly
                      ? 'text-pink-600 dark:text-pink-400'
                      : 'text-gray-800 dark:text-white'
                  }`}>
                    {ibadah.haidOnly && '🍽️ '}{isHaid && ibadah.name === 'Baca Quran' ? 'Baca Terjemahan Quran' : ibadah.name}
                    {ibadah.wajib && (
                      <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full">
                        Wajib
                      </span>
                    )}
                    {ibadah.custom && !ibadah.haidOnly && (
                      <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full">
                        Custom
                      </span>
                    )}
                    {ibadah.haidOnly && (
                      <span className="ml-2 text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 px-2 py-0.5 rounded-full">
                        Khusus Haid
                      </span>
                    )}
                    {isHaid && ibadah.name === 'Baca Quran' && (
                      <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                        Opsional
                      </span>
                    )}
                    {isHaid && (ibadah.category === 'sholat' || ibadah.category === 'sholat-sunnah' || ibadah.name === 'Puasa') && (
                      <span className="ml-2 text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 px-2 py-0.5 rounded-full">
                        Exempt
                      </span>
                    )}
                  </p>
                  {ibadah.time && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ⏰ {ibadah.time}
                    </p>
                  )}
                  {ibadah.target && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      🎯 {isHaid && ibadah.name === 'Baca Quran' ? 'Baca terjemahan' : ibadah.target}
                    </p>
                  )}
                </div>
              </div>
              
              {ibadah.custom && !ibadah.haidOnly && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteIbadah(ibadah.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <TrashIcon className="w-5 h-5" />
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Motivasi */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="ramadhan-card bg-gradient-to-br from-islamic-green to-primary-700 text-white"
      >
        <div className="flex items-center space-x-4">
          <span className="text-4xl">💫</span>
          <div>
            <p className="font-semibold">Jangan lupa!</p>
            <p className="text-sm opacity-90 mt-1">
              "Barangsiapa mendekatkan diri kepada Allah di bulan Ramadhan dengan satu kebaikan, 
              seperti ia menunaikan ibadah wajib di bulan lainnya."
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}