import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Film, Sparkles, Heart, Clock, Volume2, QrCode, Tv, MessageSquare, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import GramophonePlayer from './GramophonePlayer';

export default function TvDisplayMode({ wishes, onOpenForm }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showQrModal, setShowQrModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Target event date: 1 August 2026
  const targetDate = new Date('2026-08-01T00:00:00');

  // Countdown timer calculation
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

  // Auto-advance carousel for wishes every 7 seconds
  useEffect(() => {
    if (wishes.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % wishes.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [wishes.length, isPaused]);

  const currentWish = wishes[currentIndex] || wishes[0];
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000';

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 md:p-8 lg:p-12 overflow-hidden bg-[#0D0907]">
      {/* Vintage Cinema Background Glow & Stage Vignette */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />

      {/* TOP HEADER: Cinema Marquee & Title */}
      <header className="relative z-20 text-center max-w-5xl mx-auto mb-6">
        {/* Vintage P. Ramlee Marquee Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#1F1711] border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] mb-4">
          <Star className="w-4 h-4 text-[#D4AF37] fill-current animate-spin" />
          <span className="text-xs md:text-sm font-typewriter tracking-widest text-[#F5E6CA] uppercase">
            Panggung Sinematik P. Ramlee • Karya Khas Hari Jadi
          </span>
          <Star className="w-4 h-4 text-[#D4AF37] fill-current animate-spin" />
        </div>

        {/* Main Title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-cinema tracking-wide text-gold-gradient drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)] uppercase mb-2">
          TOK WAN HASNUL BIN MANSOR
        </h1>
        <p className="text-lg md:text-2xl font-heading text-[#F5E6CA] italic font-semibold">
          Sambutan Ulang Tahun Ke-64 • <span className="text-[#D4AF37] font-normal font-sans">1 Ogos 2026</span>
        </p>

        {/* Countdown Timer Bar */}
        <div className="mt-4 inline-flex items-center gap-4 md:gap-8 px-6 py-3 rounded-2xl bg-[#1A130E]/80 border border-[#D4AF37]/40 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-typewriter uppercase">
            <Clock className="w-4 h-4 animate-pulse" /> Detik Undur:
          </div>
          <div className="flex items-center gap-3 font-heading font-bold text-base md:text-xl text-[#F5E6CA]">
            <div>
              <span>{timeLeft.days}</span> <span className="text-xs text-[#A39274] font-normal">Hari</span>
            </div>
            <span className="text-[#D4AF37]">:</span>
            <div>
              <span>{String(timeLeft.hours).padStart(2, '0')}</span> <span className="text-xs text-[#A39274] font-normal">Jam</span>
            </div>
            <span className="text-[#D4AF37]">:</span>
            <div>
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span> <span className="text-xs text-[#A39274] font-normal">Minit</span>
            </div>
            <span className="text-[#D4AF37]">:</span>
            <div>
              <span className="text-[#D4AF37]">{String(timeLeft.seconds).padStart(2, '0')}</span> <span className="text-xs text-[#A39274] font-normal">Saat</span>
            </div>
          </div>
        </div>
      </header>

      {/* CENTER: Main Wish Showcase (Poster Frame Style) */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full my-4">
        {currentWish ? (
          <div 
            className="w-full relative bg-gradient-to-b from-[#211913] to-[#140E0A] border-4 border-[#D4AF37] rounded-3xl p-6 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden transition-all duration-700 transform hover:scale-[1.01]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Corner Filigree Accents */}
            <div className="absolute top-2 left-2 text-[#D4AF37] text-xl font-cinema">❖</div>
            <div className="absolute top-2 right-2 text-[#D4AF37] text-xl font-cinema">❖</div>
            <div className="absolute bottom-2 left-2 text-[#D4AF37] text-xl font-cinema">❖</div>
            <div className="absolute bottom-2 right-2 text-[#D4AF37] text-xl font-cinema">❖</div>

            {/* Sticker Badge Header */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#D4AF37]/30">
              <span className="px-4 py-1.5 rounded-full bg-[#8C1C1C] text-[#F5E6CA] font-bold text-xs md:text-sm tracking-wide shadow">
                {currentWish.sticker || '🌟 Seniman Agong Tok Wan'}
              </span>
              <span className="text-xs text-[#A39274] font-typewriter">
                Kad Ucapan #{currentIndex + 1} daripada {wishes.length}
              </span>
            </div>

            {/* Content Grid: Photo + Wish Message */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Photo Frame (if available) */}
              {currentWish.photo ? (
                <div className="md:col-span-4 flex justify-center">
                  <div className="relative p-2 rounded-2xl bg-[#2B1D0C] border-2 border-[#D4AF37] shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
                    <img 
                      src={currentWish.photo} 
                      alt={currentWish.sender}
                      className="w-44 h-52 object-cover rounded-xl sepia-[0.25] contrast-105"
                    />
                    <div className="mt-2 text-center text-[10px] font-typewriter text-[#D4AF37]">
                      Memori Bersama Tok Wan 📸
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Message Details */}
              <div className={currentWish.photo ? "md:col-span-8 text-left" : "md:col-span-12 text-center max-w-2xl mx-auto"}>
                <blockquote className="text-lg md:text-2xl font-heading text-[#F5E6CA] leading-relaxed italic mb-6">
                  "{currentWish.message}"
                </blockquote>

                <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-white/5">
                  <div>
                    <h3 className="text-xl font-bold font-cinema text-gold-gradient">
                      {currentWish.sender}
                    </h3>
                    <p className="text-xs text-[#A39274] font-typewriter">
                      {currentWish.relationship}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 text-xs font-semibold">
                    <Heart className="w-4 h-4 fill-current text-[#8C1C1C]" /> Penuh Kasih Sayang
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Navigation Arrows */}
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + wishes.length) % wishes.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
              title="Ucapan Sebelum"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % wishes.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
              title="Ucapan Seterusnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <div className="text-center p-12 bg-[#1A130E] border-2 border-[#D4AF37] rounded-3xl">
            <p className="text-lg font-heading text-[#F5E6CA]">Belum ada ucapan. Jadilah yang pertama mengirimkan ucapan!</p>
          </div>
        )}
      </main>

      {/* BOTTOM CONTROLS & DOCK */}
      <footer className="relative z-30 max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-[#D4AF37]/30">
        {/* Left: Gramophone Audio Component */}
        <div className="w-full md:w-auto">
          <GramophonePlayer />
        </div>

        {/* Right: Floating Control Action Buttons */}
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

      {/* QR CODE MODAL OVERLAY */}
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
            <p className="text-xs text-[#A39274] font-typewriter mb-6">
              Imbas guna kamera telefon bimbit untuk terus membuka Borang Ucapan Hari Jadi Tok Wan Hasnul!
            </p>

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
