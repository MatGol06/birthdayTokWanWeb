import React, { useState, useEffect } from 'react';
import TvDisplayMode from './components/TvDisplayMode';
import GuestWishForm from './components/GuestWishForm';
import TokWanGallery from './components/TokWanGallery';
import LiveEventPhotos from './components/LiveEventPhotos';
import AdminDashboard from './components/AdminDashboard';
import VintageCurtain from './components/VintageCurtain';
import { getStoredWishes, subscribeToWishes } from './services/wishService';
import { Tv, PenTool, Image as ImageIcon, Camera, ArrowLeft } from 'lucide-react';

export default function App() {
  const [wishes, setWishes] = useState([]);
  const [viewMode, setViewMode] = useState('tv'); // 'tv', 'form', 'gallery', 'event-photos', 'admin'

  useEffect(() => {
    setWishes(getStoredWishes());

    const unsubscribe = subscribeToWishes((data, category) => {
      if (category === 'wishes') {
        setWishes(data);
      }
    });

    return () => unsubscribe();
  }, []);

  // SECRET KEYBOARD SHORTCUT: Ctrl + Shift + A to open Admin Dashboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setViewMode('admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleWishSubmitted = () => {
    setWishes(getStoredWishes());
  };

  return (
    <VintageCurtain>
      {/* Global Vintage Overlays */}
      <div className="film-grain" />
      <div className="vignette-overlay" />

      {/* Top Mobile-Responsive Navigation Bar (Hidden Admin Button for Clean Aesthetics) */}
      <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 bg-[#1A130E]/95 border border-[#D4AF37]/50 rounded-full p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-md overflow-x-auto max-w-[94vw] scrollbar-none">
        <button
          onClick={() => setViewMode('tv')}
          className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-[11px] md:text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            viewMode === 'tv'
              ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#1A130E] shadow-md scale-105'
              : 'text-[#A89578] hover:text-[#FAF0D7]'
          }`}
        >
          <Tv className="w-3.5 h-3.5" /> TV Majlis
        </button>

        <button
          onClick={() => setViewMode('form')}
          className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-[11px] md:text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            viewMode === 'form'
              ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#1A130E] shadow-md scale-105'
              : 'text-[#A89578] hover:text-[#FAF0D7]'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" /> Ucapan
        </button>

        <button
          onClick={() => setViewMode('gallery')}
          className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-[11px] md:text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            viewMode === 'gallery'
              ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#1A130E] shadow-md scale-105'
              : 'text-[#A89578] hover:text-[#FAF0D7]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" /> Memori
        </button>

        <button
          onClick={() => setViewMode('event-photos')}
          className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-[11px] md:text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            viewMode === 'event-photos'
              ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#1A130E] shadow-md scale-105'
              : 'text-[#A89578] hover:text-[#FAF0D7]'
          }`}
        >
          <Camera className="w-3.5 h-3.5" /> Foto Live
        </button>
      </nav>

      {/* View Switcher */}
      {viewMode === 'tv' && (
        <TvDisplayMode
          wishes={wishes}
          onOpenForm={() => setViewMode('form')}
          onOpenAdmin={() => setViewMode('admin')}
        />
      )}

      {viewMode === 'form' && (
        <div className="min-h-screen pt-20 pb-12 px-3 sm:px-4 flex flex-col items-center justify-center relative z-20">
          <button
            onClick={() => setViewMode('tv')}
            className="mb-4 flex items-center gap-2 text-xs font-typewriter text-[#D4AF37] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali Ke Skrin TV Majlis
          </button>
          <GuestWishForm onWishSubmitted={handleWishSubmitted} />
        </div>
      )}

      {viewMode === 'gallery' && (
        <div className="min-h-screen pt-20 pb-12 px-3 sm:px-4 relative z-20">
          <TokWanGallery />
        </div>
      )}

      {viewMode === 'event-photos' && (
        <div className="min-h-screen pt-20 pb-12 px-3 sm:px-4 relative z-20">
          <LiveEventPhotos />
        </div>
      )}

      {viewMode === 'admin' && (
        <div className="min-h-screen pt-20 pb-12 px-3 sm:px-4 flex flex-col items-center justify-center relative z-20">
          <button
            onClick={() => setViewMode('tv')}
            className="mb-4 flex items-center gap-2 text-xs font-typewriter text-[#D4AF37] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali Ke Skrin TV Majlis
          </button>
          <AdminDashboard onClose={() => setViewMode('tv')} />
        </div>
      )}
    </VintageCurtain>
  );
}
