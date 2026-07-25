import React, { useState } from 'react';
import { Camera, Calendar, Film, Sparkles, X, Heart, Eye, Image as ImageIcon } from 'lucide-react';
import { getTokWanMemories } from '../services/wishService';

export default function TokWanGallery() {
  const [memories] = useState(getTokWanMemories());
  const [activePhoto, setActivePhoto] = useState(null);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 relative z-20">
      {/* Gallery Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1008] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-typewriter uppercase tracking-widest mb-3">
          <Film className="w-4 h-4 text-[#D4AF37]" /> Album Kenangan Abadi
        </div>
        <h2 className="text-3xl md:text-5xl font-black font-cinema text-gold-gradient tracking-wide uppercase">
          GALERI MEMORI TOK WAN HASNUL
        </h2>
        <p className="text-sm md:text-base text-[#FAF0D7] font-heading italic mt-2">
          Koleksi Gambar Kenangan Kehidupan Tok Wan (1962 – 2026)
        </p>
      </div>

      {/* Gallery Grid or Empty State */}
      {memories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {memories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => setActivePhoto(mem)}
              className="group relative bg-[#241A13] border-2 border-[#D4AF37]/50 rounded-xl p-3 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] cursor-pointer overflow-hidden"
            >
              <div className="flex items-center justify-between px-2 mb-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37]/40" />
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37]/40" />
                </div>
                <span className="text-[10px] font-typewriter text-[#D4AF37] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#D4AF37]" /> {mem.year}
                </span>
              </div>

              <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-black mb-3 border border-[#D4AF37]/30">
                <img
                  src={mem.url}
                  alt={mem.title}
                  className="w-full h-full object-cover sepia-[0.2] group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-xs text-[#FAF0D7] font-semibold flex items-center gap-1 font-typewriter">
                    <Eye className="w-3.5 h-3.5 text-[#D4AF37]" /> Lihat Gambar Penuh
                  </span>
                </div>
              </div>

              <div className="px-1">
                <h3 className="text-base font-bold font-heading text-[#FAF0D7] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                  {mem.title}
                </h3>
                <p className="text-xs text-[#A89578] font-sans mt-1 line-clamp-2">
                  {mem.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-[#241A13] border-2 border-[#D4AF37]/40 rounded-2xl max-w-lg mx-auto">
          <ImageIcon className="w-12 h-12 text-[#D4AF37] mx-auto mb-3 opacity-60" />
          <h3 className="text-xl font-bold font-cinema text-gold-gradient mb-1">
            GALERI MASIH KOSONG
          </h3>
          <p className="text-xs text-[#A89578] font-typewriter">
            Album memori sejarah Tok Wan akan dikemaskini secara berperingkat.
          </p>
        </div>
      )}

      {/* FULLSCREEN IMAGE MODAL */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-[#241A13] border-2 border-[#D4AF37] rounded-2xl p-6 md:p-8 shadow-[0_0_60px_rgba(212,175,55,0.6)]">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 text-[#A89578] hover:text-white p-2 rounded-full border border-white/10 bg-black/40"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative rounded-xl overflow-hidden mb-4 border border-[#D4AF37]/60 bg-black max-h-[60vh] flex items-center justify-center">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="max-h-[60vh] w-auto object-contain sepia-[0.15]"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4 border-t border-[#D4AF37]/30 pt-4">
              <div>
                <span className="px-3 py-1 rounded bg-[#8C1C1C] text-[#FAF0D7] font-bold text-xs font-typewriter">
                  Tahun {activePhoto.year}
                </span>
                <h3 className="text-xl md:text-2xl font-bold font-cinema text-gold-gradient mt-2">
                  {activePhoto.title}
                </h3>
                <p className="text-sm text-[#FAF0D7] font-sans mt-1">
                  {activePhoto.caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
