import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useLocalStorage from '../hooks/useLocalStorage';
import MoodCharacter from './MoodCharacter';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function RefleksiDiri() {
  const [refleksi, setRefleksi] = useLocalStorage('refleksi', []);
  const [ibadahList] = useLocalStorage('ibadahList', []);
  
  // Hitung mood berdasarkan ibadah yang diselesaikan
  const calculateMoodFromIbadah = () => {
    const completedPoints = ibadahList.filter(i => i.completed).reduce((sum, i) => sum + (i.points || 0), 0);
    const totalPoints = ibadahList.reduce((sum, i) => sum + (i.points || 0), 0);
    const ibadahProgress = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;
    
    // Konversi progress ibadah ke mood
    if (ibadahProgress >= 90) return 'excellent';
    if (ibadahProgress >= 70) return 'good';
    if (ibadahProgress >= 50) return 'calm';
    if (ibadahProgress >= 30) return 'tired';
    return 'sad';
  };
  
  const calculateIbadahProgress = () => {
    const completedPoints = ibadahList.filter(i => i.completed).reduce((sum, i) => sum + (i.points || 0), 0);
    const totalPoints = ibadahList.reduce((sum, i) => sum + (i.points || 0), 0);
    return totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;
  };
  
  const [currentRefleksi, setCurrentRefleksi] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    mood: calculateMoodFromIbadah(),
    kebersihanDiri: calculateIbadahProgress(),
    catatan: '',
    dosaDihindari: []
  });

  const [selectedMood, setSelectedMood] = useState(calculateMoodFromIbadah());
  
  // Update mood dan persen otomatis ketika ibadah berubah
  useEffect(() => {
    const newMood = calculateMoodFromIbadah();
    const newProgress = calculateIbadahProgress();
    setSelectedMood(newMood);
    setCurrentRefleksi(prev => ({ ...prev, mood: newMood, kebersihanDiri: newProgress }));
  }, [ibadahList]);

  const moods = [
    { id: 'excellent', icon: '🌟', label: 'Sangat Baik', color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { id: 'good', icon: '😊', label: 'Baik', color: 'text-green-500', bg: 'bg-green-100' },
    { id: 'calm', icon: '😌', label: 'Tenang', color: 'text-blue-500', bg: 'bg-blue-100' },
    { id: 'tired', icon: '😴', label: 'Lelah', color: 'text-purple-500', bg: 'bg-purple-100' },
    { id: 'sad', icon: '😔', label: 'Sedih', color: 'text-gray-500', bg: 'bg-gray-100' },
  ];

  const dosaList = [
    'Meninggalkan Sholat',
    'Berkata Kasar',
    'Ghibah (Membicarakan orang lain)',
    'Bohong',
    'Marah berlebihan',
    'Melihat hal haram',
    'Mendengarkan musik haram',
    'Menyakiti orang lain',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRefleksi = {
      ...currentRefleksi,
      mood: selectedMood,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    setRefleksi([newRefleksi, ...refleksi]);
    
    // Reset form
    setCurrentRefleksi({
      date: format(new Date(), 'yyyy-MM-dd'),
      mood: 'good',
      kebersihanDiri: 80,
      catatan: '',
      dosaDihindari: []
    });
    setSelectedMood('good');
  };

  const toggleDosa = (dosa) => {
    const updatedDosa = currentRefleksi.dosaDihindari.includes(dosa)
      ? currentRefleksi.dosaDihindari.filter(d => d !== dosa)
      : [...currentRefleksi.dosaDihindari, dosa];
    
    setCurrentRefleksi({
      ...currentRefleksi,
      dosaDihindari: updatedDosa
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          💭 Refleksi Diri
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Evaluasi ibadah dan perbaiki diri setiap hari
        </p>
      </div>

      {/* Mood & Karakter */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Mood Character */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="ramadhan-card text-center"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-12">
            Bagaimana perasaanmu hari ini?
          </h2>
          
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              💡 Mood & persen otomatis berubah berdasarkan ibadah yang kamu selesaikan di Ibadah Tracker
            </p>
          </div>
          
          <MoodCharacter 
            mood={selectedMood} 
            purity={currentRefleksi.kebersihanDiri}
          />
          
          <div className="mt-12 mb-8 relative">
            {currentRefleksi.kebersihanDiri >= 70 && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-2xl opacity-30"
                />
              </>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">
              Kebersihan Diri: <span className="font-bold text-primary-600 dark:text-primary-400">{currentRefleksi.kebersihanDiri}%</span>
            </p>
            {currentRefleksi.kebersihanDiri >= 70 && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm font-semibold text-green-600 dark:text-green-400 relative z-10"
              >
                ✨ Cukup Bersih!
              </motion.p>
            )}
          </div>
          
          <div className="grid grid-cols-5 gap-2 mt-12">
            {moods.map((mood) => (
              <motion.button
                key={mood.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedMood(mood.id)}
                className={`p-3 rounded-xl transition-all ${
                  selectedMood === mood.id
                    ? `${mood.bg} ring-2 ring-offset-2 ring-${mood.color}`
                    : 'bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-2xl block">{mood.icon}</span>
                <span className="text-xs mt-1 block text-gray-600 dark:text-gray-400">
                  {mood.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Form Refleksi */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="ramadhan-card"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            📝 Catatan Refleksi
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dosa yang Berhasil Dihindari
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                {dosaList.map((dosa) => (
                  <label key={dosa} className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentRefleksi.dosaDihindari.includes(dosa)}
                      onChange={() => toggleDosa(dosa)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{dosa}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catatan Refleksi
              </label>
              <textarea
                value={currentRefleksi.catatan}
                onChange={(e) => setCurrentRefleksi({...currentRefleksi, catatan: e.target.value})}
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-800 text-gray-800 dark:text-white 
                  focus:ring-2 focus:ring-primary-500"
                placeholder="Tulis refleksimu hari ini..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full btn-primary"
            >
              Simpan Refleksi
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Riwayat Refleksi */}
      <div className="ramadhan-card">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          📋 Riwayat Refleksi
        </h2>
        
        <div className="space-y-4">
          <AnimatePresence>
            {refleksi.slice(0, 5).map((item, index) => {
              const mood = moods.find(m => m.id === item.mood);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{mood?.icon}</span>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {format(new Date(item.date), 'EEEE, dd MMMM yyyy', { locale: id })}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Kebersihan diri: {item.kebersihanDiri}%
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      item.kebersihanDiri >= 80 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {item.kebersihanDiri >= 80 ? 'Bersih' : 'Perlu Perbaikan'}
                    </span>
                  </div>
                  
                  {item.dosaDihindari?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        ✅ Berhasil menghindari:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.dosaDihindari.map((dosa) => (
                          <span key={dosa} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs">
                            {dosa}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {item.catatan && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 italic">
                      "{item.catatan}"
                    </p>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {refleksi.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Belum ada catatan refleksi. Yuk refleksi hari ini!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}