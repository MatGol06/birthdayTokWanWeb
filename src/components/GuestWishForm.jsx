import React, { useState } from 'react';
import { Send, Heart, Camera, Sparkles, CheckCircle2, Film, User, MessageSquareQuote } from 'lucide-react';
import confetti from 'canvas-confetti';
import { addWish } from '../services/wishService';

const STICKERS = [
  '🌟 Seniman Agong Tok Wan',
  '👑 Tok Wan Paling Best',
  '☕ Geng Kopi Vintaj',
  '❤️ Kasih Tak Bertepi',
  '🎬 Legend Bujang Lapok',
  '🎉 Selamat Hari Jadi Tok Wan'
];

const RELATIONSHIPS = [
  'Cucu Kesayangan',
  'Anak Sulung / Bongsu',
  'Menantu',
  'Adik Beradik',
  'Sahabat Karab',
  'Jiran & Tetamu'
];

export default function GuestWishForm({ onWishSubmitted }) {
  const [sender, setSender] = useState('');
  const [relationship, setRelationship] = useState(RELATIONSHIPS[0]);
  const [message, setMessage] = useState('');
  const [selectedSticker, setSelectedSticker] = useState(STICKERS[0]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Handle local image file preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newWish = addWish({
      sender: sender.trim() || 'Tetamu Jemputan',
      relationship,
      message: message.trim(),
      sticker: selectedSticker,
      photo: photoUrl || null
    });

    // Trigger Vintage Birthday Confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F4E0A5', '#8C1C1C', '#FFFFFF']
      });
    } catch (err) {
      console.log('Confetti error:', err);
    }

    setIsSubmitted(true);
    if (onWishSubmitted) {
      onWishSubmitted(newWish);
    }
  };

  const handleReset = () => {
    setSender('');
    setMessage('');
    setPhotoUrl('');
    setIsSubmitted(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-[#18120D] border-2 border-[#D4AF37]/50 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden">
      {/* Background Gold Filigree Ambient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#8C1C1C]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-6 relative z-10">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] mb-3">
          <Film className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-cinema text-[#F5E6CA] tracking-wide">
          Buku Pelawat Vintaj
        </h2>
        <p className="text-xs md:text-sm text-[#A39274] font-typewriter mt-1">
          Hantar Ucapan & Memori Ke-64 Untuk Tok Wan Hasnul Bin Mansor
        </p>
      </div>

      {isSubmitted ? (
        <div className="text-center py-8 px-4 bg-[#231A13] border border-[#D4AF37]/40 rounded-2xl animate-fade-in">
          <CheckCircle2 className="w-16 h-16 text-[#D4AF37] mx-auto mb-4 animate-bounce" />
          <h3 className="text-xl font-bold font-heading text-[#F5E6CA] mb-2">
            Terima Kasih Atas Ucapan Indah!
          </h3>
          <p className="text-sm text-[#A39274] mb-6">
            Ucapan anda telah dihantar dan akan dipaparkan secara <span className="text-[#D4AF37] font-semibold">Live di Skrin TV Utama Majlis Tok Wan</span>! 🎉
          </p>

          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#BF953F] to-[#AA771C] hover:from-[#FCF6BA] hover:to-[#B38728] text-[#1A130E] font-bold text-sm shadow-xl transition-transform active:scale-95 cursor-pointer"
          >
            Hantar Ucapan Tambahan
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Nama Pengirim */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-2 font-typewriter">
              1. Nama / Panggilan Anda
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A39274]" />
              <input
                type="text"
                required
                placeholder="Contoh: Cucu Along / Pak Ngah"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#110C08] border border-[#D4AF37]/30 rounded-xl text-[#F5E6CA] placeholder-[#A39274]/50 focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
              />
            </div>
          </div>

          {/* Hubungan */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-2 font-typewriter">
              2. Hubungan Dengan Tok Wan
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-4 py-3 bg-[#110C08] border border-[#D4AF37]/30 rounded-xl text-[#F5E6CA] focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
            >
              {RELATIONSHIPS.map((rel) => (
                <option key={rel} value={rel} className="bg-[#18120D] text-[#F5E6CA]">
                  {rel}
                </option>
              ))}
            </select>
          </div>

          {/* Sticker Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-2 font-typewriter">
              3. Pilih Pelekat Klasik
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STICKERS.map((stk) => (
                <button
                  type="button"
                  key={stk}
                  onClick={() => setSelectedSticker(stk)}
                  className={`p-2.5 rounded-xl border text-xs text-left font-medium transition-all ${
                    selectedSticker === stk
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F5E6CA] shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                      : 'bg-[#110C08] border-white/5 text-[#A39274] hover:border-[#D4AF37]/30'
                  }`}
                >
                  {stk}
                </button>
              ))}
            </div>
          </div>

          {/* Mesej Ucapan */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-2 font-typewriter">
              4. Mesej & Doa Untuk Tok Wan Hasnul
            </label>
            <div className="relative">
              <MessageSquareQuote className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A39274]" />
              <textarea
                required
                rows={4}
                placeholder="Tulis ucapan paling manis, memori indah, atau pesanan lucu untuk Tok Wan..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#110C08] border border-[#D4AF37]/30 rounded-xl text-[#F5E6CA] placeholder-[#A39274]/50 focus:outline-none focus:border-[#D4AF37] transition-colors text-sm resize-none"
              />
            </div>
          </div>

          {/* Muat Naik Foto (Optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-2 font-typewriter">
              5. Lampirkan Gambar Bersama Tok Wan (Optional)
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#110C08] border border-dashed border-[#D4AF37]/40 rounded-xl text-xs text-[#A39274] hover:text-[#D4AF37] hover:border-[#D4AF37] cursor-pointer transition-colors">
                <Camera className="w-4 h-4" />
                {photoUrl ? 'Tukar Gambar' : 'Pilih Gambar Dari Telefon'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {photoUrl && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#D4AF37]">
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FBF5B7] to-[#AA771C] text-[#1A130E] font-bold text-base font-heading shadow-2xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
          >
            <Send className="w-5 h-5 fill-current" />
            Hantar Ucapan Ke Skrin Majlis Tok Wan!
          </button>
        </form>
      )}
    </div>
  );
}
