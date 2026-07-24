import React, { useState, useEffect } from 'react';
import TvDisplayMode from './components/TvDisplayMode';
import GuestWishForm from './components/GuestWishForm';
import VintageCurtain from './components/VintageCurtain';
import { getStoredWishes, subscribeToWishes } from './services/wishService';
import { Tv, PenTool, Sparkles, Film, Heart } from 'lucide-react';

export default function App() {
  const [wishes, setWishes] = useState([]);
  const [viewMode, setViewMode] = useState('tv'); // 'tv' or 'form'

  useEffect(() => {
    // Load initial wishes
    const initial = getStoredWishes();
    setWishes(initial);

    // Subscribe to live broadcasts from other tabs/devices
    const unsubscribe = subscribeToWishes((updatedWishes) => {
      setWishes(updatedWishes);
    });

    return () => unsubscribe();
  }, []);

  const handleWishSubmitted = () => {
    // Reload updated wishes
    const updated = getStoredWishes();
    setWishes(updated);
  };

  return (
    <VintageCurtain>
      {/* Global Vintage Film Grain & Vignette */}
      <div className="film-grain" />
      <div className="vignette-overlay" />

      {/* Floating Top Mode Navigation Switcher */}
      <nav className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-[#1A130E]/90 border border-[#D4AF37]/50 rounded-full p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md">
        <button
          onClick={() => setViewMode('tv')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            viewMode === 'tv'
              ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#1A130E] shadow-lg scale-105'
              : 'text-[#A39274] hover:text-[#F5E6CA]'
          }`}
        >
          <Tv className="w-4 h-4" /> 📺 Skrin TV Majlis
        </button>

        <button
          onClick={() => setViewMode('form')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            viewMode === 'form'
              ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#1A130E] shadow-lg scale-105'
              : 'text-[#A39274] hover:text-[#F5E6CA]'
          }`}
        >
          <PenTool className="w-4 h-4" /> ✍️ Buku Pelawat
        </button>
      </nav>

      {/* Main View Area */}
      {viewMode === 'tv' ? (
        <TvDisplayMode
          wishes={wishes}
          onOpenForm={() => setViewMode('form')}
        />
      ) : (
        <div className="min-h-screen py-16 px-4 flex flex-col items-center justify-center relative z-20">
          <button
            onClick={() => setViewMode('tv')}
            className="mb-6 flex items-center gap-2 text-xs font-typewriter text-[#D4AF37] hover:underline"
          >
            ← Kembali Ke Skrin TV Majlis
          </button>
          
          <GuestWishForm onWishSubmitted={handleWishSubmitted} />
        </div>
      )}
    </VintageCurtain>
  );
}
