import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function JadwalSholat({ mobile = false }) {
  const [jadwal, setJadwal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('Jakarta');

  useEffect(() => {
    fetchJadwalSholat();
  }, []);

  const fetchJadwalSholat = async () => {
    try {
      // Menggunakan API Aladhan
      const today = new Date();
      const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity/${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}?city=${location}&country=Indonesia&method=20`
      );
      
      if (response.data && response.data.data) {
        setJadwal(response.data.data.timings);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    } finally {
      setLoading(false);
    }
  };

  const prayerTimes = [
    { name: 'Imsak', time: jadwal?.Imsak, icon: '🌙' },
    { name: 'Subuh', time: jadwal?.Fajr, icon: '🌅' },
    { name: 'Dzuhur', time: jadwal?.Dhuhr, icon: '☀️' },
    { name: 'Ashar', time: jadwal?.Asr, icon: '🌇' },
    { name: 'Maghrib', time: jadwal?.Maghrib, icon: '🌆' },
    { name: 'Isya', time: jadwal?.Isha, icon: '🌃' },
  ];

  if (mobile) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 dark:text-white">🕌 Jadwal Sholat</h3>
          <span className="text-xs text-gray-500">{location}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {prayerTimes.map((prayer, index) => (
            <div key={prayer.name} className="text-center p-2">
              <span className="text-sm">{prayer.icon}</span>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{prayer.name}</p>
              <p className="text-xs font-bold text-gray-800 dark:text-white">
                {prayer.time || '...'}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ramadhan-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🕌</span>
          <h3 className="font-semibold text-gray-800 dark:text-white">Jadwal Sholat</h3>
        </div>
        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          {location}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {prayerTimes.map((prayer, index) => (
            <div 
              key={prayer.name}
              className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{prayer.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {prayer.name}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-800 dark:text-white">
                {prayer.time || '--:--'}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-center text-gray-500">
          📍 Wilayah {location} & sekitarnya
        </p>
      </div>
    </motion.div>
  );
}