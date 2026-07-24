import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Film, Sparkles, Heart, Clock, Volume2, QrCode, Tv, MessageSquare, ChevronLeft, ChevronRight, Star, Camera, Image as ImageIcon } from 'lucide-react';
import GramophonePlayer from './GramophonePlayer';
import { getEventPhotos } from '../services/wishService';

export default function TvDisplayMode({ wishes, onOpenForm }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayCategory, setDisplayCategory] = useState('wishes'); // 'wishes' or 'photos'
  const [eventPhotos, setEventPhotos] = useState(getEventPhotos());
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showQrModal, setShowQrModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Target event date: 1 August 2026
  const targetDate = new Date('2026-08-01T00:00:00');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync event photos
  useEffect(() => {
    setEventPhotos(getEventPhotos());
  }, [wishes]);

  const activeItems = displayCategory === 'wishes' ? wishes : eventPhotos;

  // Auto-advance carousel
  useEffect(() => {
    if (activeItems.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeItems.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [activeItems.length, isPaused]);

  const currentWish = wishes[currentIndex] || wishes[0];
  const currentPhoto = eventPhotos[currentIndex] || eventPhotos[0];
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000';

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 md:p-8 lg:p-12 overflow-hidden bg-[#0D0907]">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* TOP HEADER */}
      <header className="relative z-20 text-center max-w-5xl mx-auto mb-4">
        {/* Marquee Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#1F1711] border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] mb-3">
          <Star className="w-4 h-4 text-[#D4AF37] fill-current animate-spin" />
          <span className="text-xs md:text-sm font-typewriter tracking-widest text-[#F5E6CA] uppercase">
            Panggung Sinematik P. Ramlee • Karya Khas Hari Jadi
          </span>
          <Star className="w-4 h-4 text-[#D4AF37] fill-current animate-spin" />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-cinema tracking-wide text-gold-gradient drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)] uppercase mb-2">
          TOK WAN HASNUL BIN MANSOR
        </h1>
        <p className="text-lg md:text-2xl font-heading text-[#F5E6CA] italic font-semibold">
          Sambutan Ulang Tahun Ke-64 • <span className="text-[#D4AF37] font-normal font-sans">1 Ogos 2026</span>
        </p>

        {/* Category Switcher Tabs for TV */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => { setDisplayCategory('wishes'); setCurrentIndex(0); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all ${
              displayCategory === 'wishes'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.5)]'
                : 'bg-[#1F1711] text-[#A39274] border border-[#D4AF37]/30 hover:text-white'
            }`}
          >
            💌 Slaid Kad Ucapan
          </button>
          <button
            onClick={() => { setDisplayCategory('photos'); setCurrentIndex(0); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all ${
              displayCategory === 'photos'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.5)]'
                : 'bg-[#1F1711] text-[#A39274] border border-[#D4AF37]/30 hover:text-white'
            }`}
          >
            📸 Foto Majlis Live ({eventPhotos.length})
          </button>
        </div>
      </header>

      {/* CENTER SHOWCASE */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full my-2">
        {displayCategory === 'wishes' ? (
          currentWish ? (
            <div 
              className="w-full relative bg-gradient-to-b from-[#211913] to-[#140E0A] border-4 border-[#D4AF37] rounded-3xl p-6 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden transition-all duration-700"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#D4AF37]/30">
                <span className="px-4 py-1.5 rounded-full bg-[#8C1C1C] text-[#F5E6CA] font-bold text-xs md:text-sm shadow">
                  {currentWish.sticker || '🌟 Seniman Agong Tok Wan'}
                </span>
                <span className="text-xs text-[#A39274] font-typewriter">
                  Kad Ucapan #{currentIndex + 1} daripada {wishes.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {currentWish.photo ? (
                  <div className="md:col-span-4 flex justify-center">
                    <div className="relative p-2 rounded-2xl bg-[#2B1D0C] border-2 border-[#D4AF37] shadow-2xl rotate-[-2deg]">
                      <img 
                        src={currentWish.photo} 
                        alt={currentWish.sender}
                        className="w-44 h-52 object-cover rounded-xl sepia-[0.25]"
                      />
                    </div>
                  </div>
                ) : null}

                <div className={currentWish.photo ? "md:col-span-8 text-left" : "md:col-span-12 text-center max-w-2xl mx-auto"}>
                  <blockquote className="text-lg md:text-2xl font-heading text-[#F5E6CA] leading-relaxed italic mb-6">
                    "{currentWish.message}"
                  </blockquote>
                  <div className="pt-4 border-t border-white/5">
                    <h3 className="text-xl font-bold font-cinema text-gold-gradient">
                      {currentWish.sender}
                    </h3>
                    <p className="text-xs text-[#A39274] font-typewriter">
                      {currentWish.relationship}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null
        ) : (
          /* EVENT PHOTOS SLIDESHOW */
          currentPhoto ? (
            <div className="w-full relative bg-[#18120D] border-4 border-[#D4AF37] rounded-3xl p-6 shadow-2xl text-center">
              <div className="relative max-h-[50vh] rounded-2xl overflow-hidden bg-black mb-4 inline-block">
                <img 
                  src={currentPhoto.url} 
                  alt={currentPhoto.caption}
                  className="max-h-[50vh] w-auto object-contain rounded-xl"
                />
              </div>
              <h3 className="text-xl font-bold font-heading text-[#F5E6CA]">
                "{currentPhoto.caption}"
              </h3>
              <p className="text-xs text-[#D4AF37] font-typewriter mt-1">
                Foto Oleh: {currentPhoto.uploader}
              </p>
            </div>
          ) : null
        )}
      </main>

      {/* FOOTER CONTROLS */}
      <footer className="relative z-30 max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-[#D4AF37]/30">
        <GramophonePlayer />

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQrModal(!showQrModal)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1A130E] border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
          >
            <QrCode className="w-5 h-5" /> Impas QR Telefon
          </button>

          <button
            onClick={onOpenForm}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#1A130E] font-bold text-xs uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" /> Hantar Ucapan Baharu
          </button>
        </div>
      </footer>

      {/* QR MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1A130E] border-4 border-[#D4AF37] rounded-3xl p-8 max-w-md w-full text-center relative shadow-[0_0_50px_rgba(212,175,55,0.5)]">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-[#A39274] hover:text-white text-xl font-bold"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold font-cinema text-gold-gradient mb-2">
              Imbas QR Code
            </h3>
            <div className="bg-white p-4 rounded-2xl inline-block shadow-2xl mb-4 border-4 border-[#2B1D0C]">
              <QRCodeSVG value={currentUrl} size={200} />
            </div>
            <p className="text-xs text-[#D4AF37] font-semibold break-all bg-black/40 p-3 rounded-xl border border-[#D4AF37]/30">
              {currentUrl}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
