import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SunIcon, 
  MoonIcon,
  HomeIcon,
  BookOpenIcon,
  HeartIcon,
  ChartBarIcon,
  SparklesIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function Layout({ children, activePage, setActivePage, pages, ramadhanData }) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const calculateCountdown = () => {
      // Idul Fitri 1447 H: 20 Maret 2026
      const eidDate = new Date('2026-03-20T00:00:00+07:00'); // WIB timezone
      const now = new Date();
      const diff = eidDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (pageId) => {
    switch(pageId) {
      case 'dashboard': return <HomeIcon className="w-6 h-6" />;
      case 'ibadah': return <SparklesIcon className="w-6 h-6" />;
      case 'quran': return <BookOpenIcon className="w-6 h-6" />;
      case 'refleksi': return <HeartIcon className="w-6 h-6" />;
      case 'statistik': return <ChartBarIcon className="w-6 h-6" />;
      default: return <HomeIcon className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-white" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-white" />
          )}
        </motion.button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ 
          x: 0, 
          opacity: 1 
        }}
        transition={{ duration: 0.3 }}
        className={`w-80 bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto z-50 ${
          isMobileMenuOpen ? 'fixed inset-y-0 left-0' : 'hidden lg:block'
        }`}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 ramadhan-gradient rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🌙</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Ramadhan
                </h1>
                <p className="text-sm text-primary-600">
                  Journey {ramadhanData.year}H
                </p>
              </div>
            </div>
          </div>

          {/* Countdown Idul Fitri */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-800 to-green-700 rounded-2xl p-6 mb-8 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mt-8 -mr-8"></div>
            <div className="relative z-10">
              <p className="text-sm opacity-90 flex items-center">
                <span className="text-xl mr-2">🌙</span> 
                Countdown Idul Fitri
              </p>
              <div className="grid grid-cols-4 gap-2 mt-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{countdown.days}</p>
                  <p className="text-xs opacity-75">Hari</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{countdown.hours}</p>
                  <p className="text-xs opacity-75">Jam</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{countdown.minutes}</p>
                  <p className="text-xs opacity-75">Menit</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{countdown.seconds}</p>
                  <p className="text-xs opacity-75">Detik</p>
                </div>
              </div>
              <p className="text-xs opacity-75 mt-3 text-center">
                1 Syawal {ramadhanData.year} H
              </p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="space-y-2">
            {pages.map((page) => (
              <motion.button
                key={page.id}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActivePage(page.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl 
                  transition-all duration-300 ${
                    activePage === page.id
                      ? 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-700 dark:text-primary-400 border-l-4 border-primary-600'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
              >
                <span className={`text-2xl ${
                  activePage === page.id ? 'text-primary-600' : 'text-gray-400'
                }`}>
                  {page.icon}
                </span>
                <div className="flex-1 text-left">
                  <p className="font-semibold">{page.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {page.description}
                  </p>
                </div>
                {activePage === page.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-primary-600 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Progress Ramadhan */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {(() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const ramadhanStart = new Date(2026, 1, 18);
                  if (today < ramadhanStart) {
                    return 'Menuju Ramadhan';
                  }
                  const diffTime = today - ramadhanStart;
                  const day = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
                  return `Hari ke-${day} Ramadhan`;
                })()}
              </p>
              <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                {(() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const ramadhanStart = new Date(2026, 1, 18);
                  if (today < ramadhanStart) return '0%';
                  const diffTime = today - ramadhanStart;
                  const day = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
                  return `${((day / 30) * 100).toFixed(0)}%`;
                })()}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const ramadhanStart = new Date(2026, 1, 18);
                  if (today < ramadhanStart) return 0;
                  const diffTime = today - ramadhanStart;
                  const day = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
                  return (day / 30) * 100;
                })()}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full"
              ></motion.div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              {(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const ramadhanStart = new Date(2026, 1, 18);
                const idulFitri = new Date(2026, 2, 20);
                if (today < ramadhanStart) {
                  const daysUntil = Math.ceil((ramadhanStart - today) / (1000 * 60 * 60 * 24));
                  return `${daysUntil} hari lagi menuju Ramadhan`;
                }
                const daysToIdulFitri = Math.ceil((idulFitri - today) / (1000 * 60 * 60 * 24));
                return `${daysToIdulFitri} hari menuju Idul Fitri`;
              })()}
            </p>
          </div>

          {/* Quote of the day */}
          <div className="mt-6 p-5 bg-islamic-sand dark:bg-gray-700 rounded-xl">
            <p className="text-sm italic text-gray-700 dark:text-gray-300 font-arabic">
              "Sesungguhnya bersama kesulitan ada kemudahan"
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              QS. Al-Insyirah: 6
            </p>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}