import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import IbadahTracker from './components/IbadahTracker';
import QuranTarget from './components/QuranTarget';
import RefleksiDiri from './components/RefleksiDiri';
import Statistik from './components/Statistik';
import Sedekah from './components/Sedekah';
import LailatulQadar from './components/LailatulQadar';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [ramadhanData] = useLocalStorage('ramadhanData', {
    day: 1,
    year: 1447,
    startDate: '2026-02-28',
    endDate: '2026-03-20',
  });

  const pages = [
    { id: 'dashboard', name: 'Dashboard', icon: '🌙', description: 'Ringkasan ibadah harian' },
    { id: 'ibadah', name: 'Ibadah Tracker', icon: '🕌', description: 'Catat ibadah wajib & sunnah' },
    { id: 'quran', name: 'Target Quran', icon: '📖', description: 'Khatam 30 juz di Ramadhan' },
    { id: 'sedekah', name: 'Sedekah', icon: '💵', description: 'Catat sedekah & infaq' },
    { id: 'lailatul', name: 'Lailatul Qadar', icon: '✨', description: 'Malam lebih baik 1000 bulan' },
    { id: 'refleksi', name: 'Refleksi Diri', icon: '💭', description: 'Catat perasaan & mood' },
    { id: 'statistik', name: 'Statistik', icon: '📊', description: 'Progress ibadahmu' },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard ramadhanData={ramadhanData} setActivePage={setActivePage} />;
      case 'ibadah':
        return <IbadahTracker />;
      case 'quran':
        return <QuranTarget />;
      case 'sedekah':
        return <Sedekah />;
      case 'lailatul':
        return <LailatulQadar />;
      case 'refleksi':
        return <RefleksiDiri />;
      case 'statistik':
        return <Statistik />;
      default:
        return <Dashboard ramadhanData={ramadhanData} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen islamic-pattern">
        <Layout 
          activePage={activePage} 
          setActivePage={setActivePage} 
          pages={pages}
          ramadhanData={ramadhanData}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </Layout>
      </div>
    </ThemeProvider>
  );
}

export default App;