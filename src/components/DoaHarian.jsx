import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doaHarian } from '../data/doaHarian';

export default function DoaHarian({ mobile = false }) {
  const [doa, setDoa] = useState(null);
  const [showLatin, setShowLatin] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * doaHarian.length);
    setDoa(doaHarian[randomIndex]);
    
    // Auto change every 4 minutes (240000 ms)
    const interval = setInterval(() => {
      const newRandomIndex = Math.floor(Math.random() * doaHarian.length);
      setDoa(doaHarian[newRandomIndex]);
    }, 240000);
    
    return () => clearInterval(interval);
  }, []);
  
  const changeDoa = () => {
    const randomIndex = Math.floor(Math.random() * doaHarian.length);
    setDoa(doaHarian[randomIndex]);
  };

  if (!doa) return null;

  if (mobile) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800 dark:text-white">📖 Doa Harian</h3>
          <button onClick={() => setShowLatin(!showLatin)} className="text-xs text-primary-600">
            {showLatin ? 'Teks Arab' : 'Latin'}
          </button>
        </div>
        <p className="text-sm font-arabic text-right text-gray-800 dark:text-white leading-loose">
          {showLatin ? doa.latin : doa.arabic}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          {doa.title}
        </p>
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
          <span className="text-2xl">📖</span>
          <h3 className="font-semibold text-white">Doa Harian</h3>
        </div>
        <button
          onClick={changeDoa}
          className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition font-medium"
        >
          Ganti Doa
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
            {doa.title}
          </p>
          <button
            onClick={() => setShowLatin(!showLatin)}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {showLatin ? 'Tampilkan Arab' : 'Tampilkan Latin'}
          </button>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
          {showLatin ? (
            <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
              {doa.latin}
            </p>
          ) : (
            <p className="text-xl font-arabic text-right text-gray-800 dark:text-white leading-loose">
              {doa.arabic}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Artinya:</span> {doa.meaning}
          </p>
        </div>
      </div>
    </motion.div>
  );
}