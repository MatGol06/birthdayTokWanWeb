import React, { useState } from 'react';
import { Send, Heart, Camera, CheckCircle2, Film, User, MessageSquareQuote, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { addWish } from '../services/wishService';

const RELATIONSHIPS = [
  'Cucu Kesayangan',
  'Anak Sulung / Bongsu',
  'Menantu',
  'Adik Beradik',
  'Sahabat Karab',
  'Jiran & Tetamu',
  'Lain-lain (Tulis Sendiri)'
];

export default function GuestWishForm({ onWishSubmitted }) {
  const [sender, setSender] = useState('');
  const [relationship, setRelationship] = useState(RELATIONSHIPS[0]);
  const [customRelationship, setCustomRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    setErrorMessage('');
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Saiz gambar terlalu besar! Sila pilih gambar di bawah 5MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Format fail tidak sah! Sila pilih fail gambar sahaja.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!message.trim() || isSubmitting) return;

    // Determine final relationship text
    const finalRelationship = relationship === 'Lain-lain (Tulis Sendiri)'
      ? (customRelationship.trim() || 'Tetamu Jemputan')
      : relationship;

    const lastSubmission = localStorage.getItem('last_wish_submission_time');
    const now = Date.now();
    if (lastSubmission && now - parseInt(lastSubmission) < 30000) {
      const waitSeconds = Math.ceil((30000 - (now - parseInt(lastSubmission))) / 1000);
      setErrorMessage(`Sila tunggu ${waitSeconds} saat sebelum menghantar ucapan seterusnya.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const newWish = await addWish({
        sender: sender.trim() || 'Tetamu Jemputan',
        relationship: finalRelationship,
        message: message.trim(),
        photo: photoUrl || null
      });

      localStorage.setItem('last_wish_submission_time', now.toString());

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#F4E0A5', '#8C1C1C', '#FFFFFF']
        });
      } catch (err) {}

      setIsSubmitted(true);
      if (onWishSubmitted) {
        onWishSubmitted(newWish);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Ralat semasa menghantar ucapan. Sila cuba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSender('');
    setRelationship(RELATIONSHIPS[0]);
    setCustomRelationship('');
    setMessage('');
    setPhotoUrl('');
    setErrorMessage('');
    setIsSubmitted(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-[#241A13] border-2 border-[#D4AF37] rounded-2xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-6 relative z-10">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#1A1008] border border-[#D4AF37]/40 text-[#D4AF37] mb-3">
          <Film className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-cinema text-gold-gradient tracking-wide uppercase">
          Buku Pelawat Vintaj
        </h2>
        <p className="text-xs md:text-sm text-[#A89578] font-typewriter mt-1">
          Hantar Ucapan & Memori Ke-64 Untuk Tok Wan Hasnul Bin Mansor
        </p>
      </div>

      {isSubmitted ? (
        <div className="text-center py-8 px-4 bg-[#1A1008] border border-[#D4AF37]/40 rounded-xl animate-fade-in">
          <CheckCircle2 className="w-14 h-14 text-[#D4AF37] mx-auto mb-4 animate-bounce" />
          <h3 className="text-xl font-bold font-heading text-[#FAF0D7] mb-2">
            Terima Kasih Atas Ucapan Indah!
          </h3>
          <p className="text-xs text-[#A89578] mb-6 font-sans">
            Ucapan anda telah dihantar dan akan dipaparkan secara <strong className="text-[#D4AF37]">Live di Skrin TV Utama Majlis Tok Wan</strong>.
          </p>

          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#996515] text-black font-bold text-xs uppercase tracking-wider font-heading shadow-xl cursor-pointer"
          >
            Hantar Ucapan Tambahan
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {errorMessage && (
            <div className="p-3 bg-[#8C1C1C]/20 border border-[#8C1C1C] rounded-xl text-xs text-[#FAF0D7] text-center font-sans font-semibold">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Nama Pengirim */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-2 font-typewriter">
              1. Nama / Panggilan Anda
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A89578]" />
              <input
                type="text"
                required
                maxLength={60}
                placeholder="Contoh: Cucu Along / Pak Ngah"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1A1008] border border-[#D4AF37]/30 rounded-xl text-[#FAF0D7] placeholder-[#A89578]/50 focus:outline-none focus:border-[#D4AF37] text-sm"
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
              className="w-full px-4 py-3 bg-[#1A1008] border border-[#D4AF37]/30 rounded-xl text-[#FAF0D7] focus:outline-none focus:border-[#D4AF37] text-sm"
            >
              {RELATIONSHIPS.map((rel) => (
                <option key={rel} value={rel} className="bg-[#241A13] text-[#FAF0D7]">
                  {rel}
                </option>
              ))}
            </select>

            {/* Custom Relationship Input Field */}
            {relationship === 'Lain-lain (Tulis Sendiri)' && (
              <div className="relative mt-2.5 animate-fade-in">
                <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-[#D4AF37]" />
                <input
                  type="text"
                  required
                  maxLength={50}
                  placeholder="Taip hubungan anda (Contoh: Anak Saudara / Bekas Rakan Kerja)"
                  value={customRelationship}
                  onChange={(e) => setCustomRelationship(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1A1008] border-2 border-[#D4AF37] rounded-xl text-[#FAF0D7] placeholder-[#A89578]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
                />
              </div>
            )}
          </div>

          {/* Mesej Ucapan */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-2 font-typewriter">
              3. Mesej & Doa Untuk Tok Wan Hasnul
            </label>
            <div className="relative">
              <MessageSquareQuote className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A89578]" />
              <textarea
                required
                maxLength={500}
                rows={4}
                placeholder="Tulis ucapan paling manis, memori indah, atau pesanan mesra untuk Tok Wan..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1A1008] border border-[#D4AF37]/30 rounded-xl text-[#FAF0D7] placeholder-[#A89578]/50 focus:outline-none focus:border-[#D4AF37] text-sm resize-none"
              />
            </div>
          </div>

          {/* Muat Naik Foto */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-2 font-typewriter">
              4. Lampirkan Gambar Bersama Tok Wan (Optional, Max 5MB)
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#1A1008] border border-dashed border-[#D4AF37]/40 rounded-xl text-xs text-[#A89578] hover:text-[#D4AF37] hover:border-[#D4AF37] cursor-pointer transition-colors">
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
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#996515] text-black font-bold text-sm font-heading shadow-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer uppercase tracking-wider disabled:opacity-50"
          >
            <Send className="w-4 h-4 fill-current" />
            {isSubmitting ? 'Menghantar Ucapan...' : 'Hantar Ucapan Ke Skrin Majlis Tok Wan!'}
          </button>
        </form>
      )}
    </div>
  );
}
