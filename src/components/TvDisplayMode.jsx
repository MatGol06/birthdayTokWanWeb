import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Film, Clock, QrCode, MessageSquare, ChevronLeft, ChevronRight, Volume2, Star } from 'lucide-react';
import GramophonePlayer from './GramophonePlayer';
import { getEventPhotos } from '../services/wishService';

export default function TvDisplayMode({ wishes, onOpenForm }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayCategory, setDisplayCategory] = useState('wishes'); // 'wishes' or 'photos'
  const [eventPhotos, setEventPhotos] = useState(getEventPhotos());
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showQrModal, setShowQrModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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

  useEffect(() => {
    setEventPhotos(getEventPhotos());
  }, [wishes]);

  const activeItems = displayCategory === 'wishes' ? wishes : eventPhotos;

  useEffect(() => {
    if (activeItems.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeItems.length);
    }, 7500);

    return () => clearInterval(timer);
  }, [activeItems.length, isPaused]);

  const currentWish = wishes[currentIndex] || wishes[0];
  const currentPhoto = eventPhotos[currentIndex] || eventPhotos[0];
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000';

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 md:p-8 lg:p-10 bg-[#140E0A] text-[#FAF0D7] selection:bg-[#D4AF37] selection:text-black">
      {/* Background Vintage Cinema Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none" />

      {/* TOP MARQUEE HEADER (Bespoke Cinema Broadsheet) */}
      <header className="relative z-20 max-w-6xl mx-auto w-full mb-6 border-b-2 border-[#D4AF37]/30 pb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Film Production Seal */}
          <div className="text-left hidden md:block">
            <span className="text-[11px] font-typewriter text-[#D4AF37] tracking-widest uppercase block">
              PANGGUNG CINEPLEX 1950s
            </span>
            <span className="text-xs font-sans text-[#A89578]">
              EDISI KHAS ULANG TAHUN
            </span>
          </div>

          {/* Center: Cinema Title */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#241A13] border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-typewriter uppercase tracking-widest mb-2">
              <Star className="w-3 h-3 text-[#D4AF37] fill-current" /> PERSEMBAHAN UTAMA <Star className="w-3 h-3 text-[#D4AF37] fill-current" />
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-cinema tracking-wider text-gold-gradient uppercase drop-shadow">
              TOK WAN HASNUL BIN MANSOR
            </h1>
            <p className="text-sm md:text-lg font-heading text-[#FAF0D7] italic mt-1">
              Sambutan Ulang Tahun Ke-64 • <span className="text-[#D4AF37] font-normal font-sans">1 Ogos 2026</span>
            </p>
          </div>

          {/* Right: Countdown Counter */}
          <div className="text-right flex items-center gap-3 bg-[#241A13] px-4 py-2 rounded-xl border border-[#D4AF37]/40 shadow-inner">
            <Clock className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <div className="font-heading font-bold text-sm md:text-base text-[#FAF0D7]">
              <span>{timeLeft.days}D</span> : <span>{String(timeLeft.hours).padStart(2, '0')}H</span> : <span>{String(timeLeft.minutes).padStart(2, '0')}M</span> : <span className="text-[#D4AF37]">{String(timeLeft.seconds).padStart(2, '0')}S</span>
            </div>
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => { setDisplayCategory('wishes'); setCurrentIndex(0); }}
            className={`px-5 py-2 rounded-lg text-xs font-bold font-typewriter transition-all cursor-pointer ${
              displayCategory === 'wishes'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                : 'bg-[#241A13] text-[#A89578] border border-[#D4AF37]/30 hover:text-white'
            }`}
          >
            💌 Slaid Kad Ucapan ({wishes.length})
          </button>
          <button
            onClick={() => { setDisplayCategory('photos'); setCurrentIndex(0); }}
            className={`px-5 py-2 rounded-lg text-xs font-bold font-typewriter transition-all cursor-pointer ${
              displayCategory === 'photos'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                : 'bg-[#241A13] text-[#A89578] border border-[#D4AF37]/30 hover:text-white'
            }`}
          >
            📸 Foto Majlis Live ({eventPhotos.length})
          </button>
        </div>
      </header>

      {/* CENTER: ASYMMETRIC POSTER SHOWCASE (Anti-AI-Slop Layout) */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full my-4">
        {displayCategory === 'wishes' ? (
          currentWish ? (
            <div 
              className="w-full relative bg-[#261D16] border-2 border-[#D4AF37] rounded-2xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Corner Filigree Brass Rivets */}
              <div className="absolute top-3 left-3 text-[#D4AF37] text-xs font-typewriter">❖ 1950s</div>
              <div className="absolute top-3 right-3 text-[#D4AF37] text-xs font-typewriter">❖ EDISI VINTAJ</div>

              {/* Stamp Badge */}
              <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#D4AF37]/30">
                <span className="stamp-badge">
                  {currentWish.sticker || '🌟 Seniman Agong Tok Wan'}
                </span>
                <span className="text-xs text-[#A89578] font-typewriter">
                  KAD UCAPAN #{currentIndex + 1} DARI {wishes.length}
                </span>
              </div>

              {/* Asymmetric Grid: Photo Poster on Left, Lettercard on Right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {currentWish.photo ? (
                  <div className="md:col-span-5 flex justify-center">
                    <div className="relative p-2 rounded-xl bg-[#1A1008] border-2 border-[#D4AF37] shadow-2xl film-sprocket-border">
                      <img 
                        src={currentWish.photo} 
                        alt={currentWish.sender}
                        className="w-56 h-64 object-cover rounded-lg sepia-[0.25] contrast-105"
                      />
                      <div className="mt-2 text-center text-[10px] font-typewriter text-[#D4AF37]">
                        MEMORI BERSAMA TOK WAN 📸
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className={currentWish.photo ? "md:col-span-7 text-left" : "md:col-span-12 text-center max-w-2xl mx-auto"}>
                  <blockquote className="text-lg md:text-2xl font-heading text-[#FAF0D7] leading-relaxed italic mb-6">
                    "{currentWish.message}"
                  </blockquote>

                  <div className="pt-4 border-t border-[#D4AF37]/20 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-2xl font-bold font-cinema text-gold-gradient">
                        {currentWish.sender}
                      </h3>
                      <p className="text-xs text-[#A89578] font-typewriter mt-0.5">
                        {currentWish.relationship}
                      </p>
                    </div>

                    <div className="text-xs text-[#D4AF37] font-typewriter px-3 py-1 rounded border border-[#D4AF37]/40 bg-[#1A1008]">
                      SEKeluarga ❤️
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Arrow Controls */}
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + wishes.length) % wishes.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % wishes.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : null
        ) : (
          /* EVENT PHOTOS SLIDESHOW */
          currentPhoto ? (
            <div className="w-full relative bg-[#261D16] border-2 border-[#D4AF37] rounded-2xl p-6 shadow-2xl text-center">
              <div className="relative max-h-[50vh] rounded-xl overflow-hidden bg-black mb-4 inline-block border-2 border-[#D4AF37]/40">
                <img 
                  src={currentPhoto.url} 
                  alt={currentPhoto.caption}
                  className="max-h-[50vh] w-auto object-contain rounded-lg"
                />
              </div>
              <h3 className="text-xl font-bold font-heading text-[#FAF0D7]">
                "{currentPhoto.caption}"
              </h3>
              <p className="text-xs text-[#D4AF37] font-typewriter mt-1">
                FOTO MAJLIS LIVE OLEH: {currentPhoto.uploader}
              </p>
            </div>
          ) : null
        )}
      </main>

      {/* FOOTER CONTROLS & GRAMOPHONE */}
      <footer className="relative z-30 max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-[#D4AF37]/30">
        <GramophonePlayer />

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQrModal(!showQrModal)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#241A13] border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
          >
            <QrCode className="w-4 h-4" /> Impas QR Telefon
          </button>

          <button
            onClick={onOpenForm}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#996515] text-black font-bold text-xs uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer font-heading"
          >
            <MessageSquare className="w-4 h-4" /> Hantar Ucapan Baharu
          </button>
        </div>
      </footer>

      {/* QR MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#241A13] border-2 border-[#D4AF37] rounded-2xl p-8 max-w-md w-full text-center relative shadow-[0_0_50px_rgba(212,175,55,0.5)]">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-[#A89578] hover:text-white text-xl font-bold"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold font-cinema text-gold-gradient mb-2">
              Imbas QR Code
            </h3>
            <p className="text-xs text-[#A89578] font-typewriter mb-4">
              Imbas dengan kamera telefon untuk menghantar ucapan & gambar majlis!
            </p>
            <div className="bg-white p-4 rounded-xl inline-block shadow-2xl mb-4 border-2 border-[#D4AF37]">
              <QRCodeSVG value={currentUrl} size={200} />
            </div>
            <p className="text-xs text-[#D4AF37] font-semibold break-all bg-black/40 p-3 rounded-lg border border-[#D4AF37]/30">
              {currentUrl}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
