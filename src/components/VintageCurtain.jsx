import React, { useState, useEffect } from 'react';

export default function VintageCurtain({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Left Curtain */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-1/2 bg-gradient-to-r from-[#5C1010] via-[#8C1C1C] to-[#3B0A0A] border-r-4 border-[#D4AF37] z-50 transition-transform duration-1000 ease-in-out shadow-2xl flex items-center justify-end pr-8 ${
          isOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="w-16 h-full bg-black/20 blur-md" />
      </div>

      {/* Right Curtain */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-[#5C1010] via-[#8C1C1C] to-[#3B0A0A] border-l-4 border-[#D4AF37] z-50 transition-transform duration-1000 ease-in-out shadow-2xl flex items-center justify-start pl-8 ${
          isOpen ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="w-16 h-full bg-black/20 blur-md" />
      </div>

      {/* Center Welcome Badge during Curtain Opening */}
      {!isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center p-8 bg-black/90 border-4 border-[#D4AF37] rounded-3xl shadow-[0_0_80px_rgba(212,175,55,0.6)] animate-pulse">
            <h2 className="text-2xl md:text-4xl font-black font-cinema text-gold-gradient uppercase tracking-widest">
              MEMPERSEMBAHKAN
            </h2>
            <p className="text-sm font-heading text-[#F5E6CA] mt-2">
              Hari Jadi Tok Wan Hasnul Bin Mansor Ke-64
            </p>
          </div>
        </div>
      )}

      {/* Main Content Rendered Behind Curtain */}
      {children}
    </div>
  );
}
