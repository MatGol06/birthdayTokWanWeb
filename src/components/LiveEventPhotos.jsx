import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, Upload, User, CheckCircle2, Film } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getEventPhotos, addEventPhoto } from '../services/wishService';

export default function LiveEventPhotos({ onPhotoUploaded }) {
  const [photos, setPhotos] = useState(getEventPhotos());
  const [uploader, setUploader] = useState('');
  const [caption, setCaption] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!photoUrl) return;

    const newPhoto = addEventPhoto({
      uploader: uploader.trim() || 'Tetamu Majlis',
      caption: caption.trim() || 'Suasana Majlis Hari Jadi Tok Wan Hasnul',
      url: photoUrl
    });

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#8C1C1C', '#FFFFFF']
      });
    } catch (err) {}

    const updated = getEventPhotos();
    setPhotos(updated);
    setPhotoUrl('');
    setCaption('');
    setShowUploadForm(false);

    if (onPhotoUploaded) {
      onPhotoUploaded(newPhoto);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 relative z-20">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1008] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-typewriter uppercase tracking-widest mb-3">
          <Camera className="w-4 h-4 text-[#D4AF37]" /> Live Event Photo Album • 1 Ogos 2026
        </div>
        <h2 className="text-3xl md:text-5xl font-black font-cinema text-gold-gradient tracking-wide uppercase">
          ALBUM GAMBAR MAJLIS LIVE
        </h2>
        <p className="text-sm md:text-base text-[#FAF0D7] font-heading italic mt-2">
          Muat naik foto kenangan anda semasa majlis sambutan Tok Wan Hasnul berlangsung!
        </p>

        <div className="mt-6">
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#996515] text-black font-bold text-sm font-heading uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            {showUploadForm ? 'Tutup Borang Upload' : 'Muat Naik Foto Majlis Anda'}
          </button>
        </div>
      </div>

      {/* UPLOAD FORM */}
      {showUploadForm && (
        <form 
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto mb-10 bg-[#241A13] border-2 border-[#D4AF37] rounded-2xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] animate-fade-in"
        >
          <h3 className="text-xl font-bold font-cinema text-gold-gradient mb-4 text-center">
            Muat Naik Foto Suasana Majlis
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1 font-typewriter">
                Nama Pengirim / Tetamu
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Pak Su & Mak Su"
                value={uploader}
                onChange={(e) => setUploader(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A1008] border border-[#D4AF37]/30 rounded-xl text-[#FAF0D7] placeholder-[#A89578]/50 focus:outline-none focus:border-[#D4AF37] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1 font-typewriter">
                Nota / Keterangan Foto
              </label>
              <input
                type="text"
                placeholder="Contoh: Sesi potong kek Tok Wan!"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A1008] border border-[#D4AF37]/30 rounded-xl text-[#FAF0D7] placeholder-[#A89578]/50 focus:outline-none focus:border-[#D4AF37] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1 font-typewriter">
                Pilih Gambar Dari Telefon / Kamera
              </label>
              <label className="flex items-center justify-center gap-2 py-4 px-4 bg-[#1A1008] border-2 border-dashed border-[#D4AF37]/50 rounded-xl text-sm text-[#A89578] hover:text-[#D4AF37] hover:border-[#D4AF37] cursor-pointer transition-colors">
                <Camera className="w-5 h-5 text-[#D4AF37]" />
                {photoUrl ? 'Gambar Dipilih' : 'Ambil Foto / Pilih Dari Galeri'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {photoUrl && (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-[#D4AF37] bg-black">
                <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <button
              type="submit"
              disabled={!photoUrl}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#996515] text-black font-bold text-sm font-heading uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              Kongsi Foto Ke Skrin Majlis!
            </button>
          </div>
        </form>
      )}

      {/* LIVE EVENT PHOTO GRID OR EMPTY STATE */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((pt) => (
            <div
              key={pt.id}
              className="bg-[#241A13] border-2 border-[#D4AF37]/40 rounded-xl p-3 shadow-xl hover:border-[#D4AF37] transition-all overflow-hidden"
            >
              <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-black mb-3 border border-[#D4AF37]/30">
                <img
                  src={pt.url}
                  alt={pt.caption}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="px-1">
                <p className="text-sm font-bold font-heading text-[#FAF0D7] line-clamp-2">
                  "{pt.caption}"
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-xs text-[#A89578] font-typewriter">
                  <span>Oleh: <strong className="text-[#D4AF37]">{pt.uploader}</strong></span>
                  <span>{new Date(pt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-[#241A13] border-2 border-[#D4AF37]/40 rounded-2xl max-w-lg mx-auto">
          <Camera className="w-12 h-12 text-[#D4AF37] mx-auto mb-3 opacity-60 animate-pulse" />
          <h3 className="text-xl font-bold font-cinema text-gold-gradient mb-1">
            BELUM ADA FOTO MAJLIS LIVE
          </h3>
          <p className="text-xs text-[#A89578] font-typewriter">
            Jadilah orang pertama yang memuat naik foto kenangan suasana majlis Tok Wan!
          </p>
        </div>
      )}
    </div>
  );
}
