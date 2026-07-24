import React, { useState, useEffect } from 'react';

export default function VintageCurtain({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // Trigger opening transition after 600ms
    const openTimer = setTimeout(() => {
      setIsOpen(true);
    }, 600);

    // Unmount curtain overlay completely after transition completes
    const removeTimer = setTimeout(() => {
      setIsRemoved(true);
    }, 1800);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {!isRemoved && (
        <>
          {/* Left Curtain */}
          <div 
            className={`fixed top-0 left-0 bottom-0 w-1/2 bg-gradient-to-r from-[#4A0A0A] via-[#8C1C1C] to-[#2B0505] border-r-4 border-[#D4AF37] z-50 transition-transform duration-1000 ease-in-out shadow-2xl ${
              isOpen ? '-translate-x-full' : 'translate-x-0'
            }`}
          />

          {/* Right Curtain */}
          <div 
            className={`fixed top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-[#4A0A0A] via-[#8C1C1C] to-[#2B0505] border-l-4 border-[#D4AF37] z-50 transition-transform duration-1000 ease-in-out shadow-2xl ${
              isOpen ? 'translate-x-full' : 'translate-x-0'
            }`}
          />

          {/* Welcome Badge */}
          {!isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className="text-center p-6 bg-black/90 border-2 border-[#D4AF37] rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.5)]">
                <h2 className="text-xl md:text-3xl font-bold font-cinema text-gold-gradient uppercase tracking-widest">
                  MEMPERSEMBAHKAN
                </h2>
                <p className="text-xs md:text-sm font-heading text-[#FAF0D7] mt-1">
                  Hari Jadi Tok Wan Hasnul Bin Mansor Ke-64
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Main Content */}
      {children}
    </div>
  );
}
