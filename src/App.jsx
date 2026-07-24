import React, { useState, useEffect } from 'react';
import TvDisplayMode from './components/TvDisplayMode';
import GuestWishForm from './components/GuestWishForm';
import TokWanGallery from './components/TokWanGallery';
import LiveEventPhotos from './components/LiveEventPhotos';
import VintageCurtain from './components/VintageCurtain';
import { getStoredWishes, subscribeToWishes } from './services/wishService';
import { Tv, PenTool, Image as ImageIcon, Camera, ArrowLeft } from 'lucide-react';

export default function App() {
  const [wishes, setWishes] = useState([]);
  const [viewMode, setViewMode] = useState('tv'); // 'tv', 'form', 'gallery', 'event-photos'

  useEffect(() => {
    setWishes(getStoredWishes());

    const unsubscribe = subscribeToWishes((data, category) => {
      if (category === 'wishes') {
        setWishes(data);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleWishSubmitted = () => {
    setWishes(getStoredWishes());
  };

  return (
    <VintageCurtain>
      {/* Global Vintage Overlays */}
      <div className="film-grain" />
      <div className="vignette-overlay" />

      {/* Top Mode Navigation Switcher */}
      <nav className="fixed top-4 right-4 z-40 flex items-center gap-1.5 bg-[#1A130E]/95 border border-[#D4AF37]/50 rounded-full p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-md overflow-x-auto max-w-[95vw]">
        <button
          onClick={() => setViewMode('tv')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            viewMode === 'tv'
              ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#1A130E] shadow-lg scale-105'
              : 'text-[#A89578] hover:text-[#FAF0D7]'
          }`}
        >
          <Tv className="w-4 h-4 text-[#1A130E]" /> TV Majlis
        </button>

        <button
          onClick={() => setViewMode('form')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            viewMode === 'form'
              ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#1A130E] shadow-lg scale-105'
              : 'text-[#A89578] hover:text-[#FAF0D7]'
          }`}
        >
          <PenTool className="w-4 h-4" /> Ucapan
        </button>

        <button
          onClick={() => setViewMode('gallery')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            viewMode === 'gallery'
              ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#1A130E] shadow-lg scale-105'
              : 'text-[#A89578] hover:text-[#FAF0D7]'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Memori Tok Wan
        </button>

        <button
          onClick={() => setViewMode('event-photos')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            viewMode === 'event-photos'
              ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#1A130E] shadow-lg scale-105'
              : 'text-[#A89578] hover:text-[#FAF0D7]'
          }`}
        >
          <Camera className="w-4 h-4" /> Foto Majlis Live
        </button>
      </nav>

      {/* View Switcher */}
      {viewMode === 'tv' && (
        <TvDisplayMode
          wishes={wishes}
          onOpenForm={() => setViewMode('form')}
        />
      )}

      {viewMode === 'form' && (
        <div className="min-h-screen py-16 px-4 flex flex-col items-center justify-center relative z-20">
          <button
            onClick={() => setViewMode('tv')}
            className="mb-6 flex items-center gap-2 text-xs font-typewriter text-[#D4AF37] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali Ke Skrin TV Majlis
          </button>
          <GuestWishForm onWishSubmitted={handleWishSubmitted} />
        </div>
      )}

      {viewMode === 'gallery' && (
        <div className="min-h-screen py-16 px-4 relative z-20">
          <TokWanGallery />
        </div>
      )}

      {viewMode === 'event-photos' && (
        <div className="min-h-screen py-16 px-4 relative z-20">
          <LiveEventPhotos />
        </div>
      )}
    </VintageCurtain>
  );
}
