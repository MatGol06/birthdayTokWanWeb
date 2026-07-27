import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, Upload, User, CheckCircle2, Film, Download, Eye, X, Plus, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getEventPhotos, addEventPhoto } from '../services/wishService';

export default function LiveEventPhotos({ onPhotoUploaded }) {
  const [photos, setPhotos] = useState(getEventPhotos());
  const [uploader, setUploader] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState([]); // Array of Base64 strings
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Album viewer modal state
  const [activeAlbum, setActiveAlbum] = useState(null); // The album object
  const [activePhotoIndex, setActivePhotoIndex] = useState(0); // Selected photo index inside album
  
  const [errorMessage, setErrorMessage] = useState('');

  // MULTI-PHOTO FILE SELECTION HANDLER
  const handleMultipleFilesChange = (e) => {
    setErrorMessage('');
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    if (files.length + selectedPhotos.length > 10) {
      setErrorMessage('Maksimum 10 gambar sahaja dibenarkan dalam satu album muat naik.');
      return;
    }

    const validDataUrls = [];
    let processedCount = 0;

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(`Gambar "${file.name}" melebihi 5MB dan telah diabaikan.`);
        return;
      }
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        validDataUrls.push(reader.result);
        processedCount++;
        if (processedCount === files.length) {
          setSelectedPhotos((prev) => [...prev, ...validDataUrls]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveSelectedPhoto = (indexToRemove) => {
    setSelectedPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // SUBMIT ALL SELECTED PHOTOS AS A SINGLE ALBUM BOX
  const handleSubmitBatch = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (selectedPhotos.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const uploaderName = uploader.trim() || 'Tetamu Majlis';
      const photoCaption = caption.trim() || 'Suasana Majlis Hari Jadi Tok Wan Hasnul';

      // Save as ONE album record
      await addEventPhoto({
        uploader: uploaderName,
        caption: photoCaption,
        urls: selectedPhotos
      });

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#8C1C1C', '#FFFFFF']
        });
      } catch (err) {}

      const updated = getEventPhotos();
      setPhotos(updated);
      setSelectedPhotos([]);
      setCaption('');
      setShowUploadForm(false);

      if (onPhotoUploaded) {
        onPhotoUploaded();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Ralat semasa memuat naik gambar. Sila cuba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open album modal
  const handleOpenAlbum = (album) => {
    setActiveAlbum(album);
    setActivePhotoIndex(0);
  };

  // Helper to trigger image file download
  const handleDownloadImage = (url, filename = 'tokwan-foto-majlis.jpg') => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          Himpunan koleksi foto kenangan sambutan Ulang Tahun Ke-64 Tok Wan Hasnul!
        </p>

        <div className="mt-6">
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#996515] text-black font-bold text-sm font-heading uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            {showUploadForm ? 'Tutup Borang Upload' : 'Muat Naik Album Foto (Pelbagai Gambar)'}
          </button>
        </div>
      </div>

      {/* MULTI-PHOTO BATCH UPLOAD FORM */}
      {showUploadForm && (
        <form 
          onSubmit={handleSubmitBatch}
          className="max-w-lg mx-auto mb-10 bg-[#241A13] border-2 border-[#D4AF37] rounded-2xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] animate-fade-in"
        >
          <div className="flex items-center justify-center gap-2 mb-2 text-[#D4AF37]">
            <Layers className="w-5 h-5 animate-pulse" />
            <h3 className="text-xl font-bold font-cinema text-gold-gradient text-center">
              Cipta Album Foto Majlis Baharu
            </h3>
          </div>
          <p className="text-xs text-[#A89578] text-center font-typewriter mb-6">
            Pilih pelbagai gambar sekaligus untuk dihimpunkan ke dalam 1 Kad Album tunggal
          </p>

          {errorMessage && (
            <div className="p-3 mb-4 bg-[#8C1C1C]/20 border border-[#8C1C1C] rounded-xl text-xs text-[#FAF0D7] text-center font-sans font-semibold">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1 font-typewriter">
                1. Nama Pengirim / Tetamu
              </label>
              <input
                type="text"
                required
                maxLength={60}
                placeholder="Contoh: Pak Su & Mak Su"
                value={uploader}
                onChange={(e) => setUploader(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A1008] border border-[#D4AF37]/30 rounded-xl text-[#FAF0D7] placeholder-[#A89578]/50 focus:outline-none focus:border-[#D4AF37] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1 font-typewriter">
                2. Tajuk / Keterangan Album
              </label>
              <input
                type="text"
                maxLength={200}
                placeholder="Contoh: Sesi potong kek & bergambar bersama Tok Wan"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A1008] border border-[#D4AF37]/30 rounded-xl text-[#FAF0D7] placeholder-[#A89578]/50 focus:outline-none focus:border-[#D4AF37] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1 font-typewriter">
                3. Pilih Gambar Album (Boleh Pilih Banyak Sekaligus)
              </label>
              <label className="flex flex-col items-center justify-center gap-2 py-5 px-4 bg-[#1A1008] border-2 border-dashed border-[#D4AF37]/50 rounded-xl text-sm text-[#A89578] hover:text-[#D4AF37] hover:border-[#D4AF37] cursor-pointer transition-colors text-center">
                <Camera className="w-6 h-6 text-[#D4AF37]" />
                <span className="font-bold text-[#FAF0D7]">
                  {selectedPhotos.length > 0 ? `Tambah Gambar Lagi (${selectedPhotos.length} Dipilih)` : 'Pilih Gambar Dari Telefon (Boleh Tekan Banyak)'}
                </span>
                <span className="text-[10px] text-[#A89578] font-typewriter">
                  Semua gambar yang dipilih akan digabungkan ke dalam 1 Kad Album sahaja.
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleFilesChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* PREVIEW OF ALL SELECTED PHOTOS */}
            {selectedPhotos.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs text-[#D4AF37] font-typewriter mb-2">
                  <span>GAMBAR DIPILIH ({selectedPhotos.length}):</span>
                  <button 
                    type="button" 
                    onClick={() => setSelectedPhotos([])}
                    className="text-[#8C1C1C] hover:underline"
                  >
                    Kosongkan Semua
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-[#1A1008] rounded-xl border border-[#D4AF37]/30">
                  {selectedPhotos.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[#D4AF37]/60 group">
                      <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveSelectedPhoto(idx)}
                        className="absolute top-1 right-1 bg-black/80 text-white rounded-full p-0.5 hover:bg-[#8C1C1C]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-center text-[#D4AF37] font-typewriter py-0.5">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={selectedPhotos.length === 0 || isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#996515] text-black font-bold text-sm font-heading uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Memuat Naik Album...' : `Cipta 1 Album Dengan ${selectedPhotos.length} Foto!`}
            </button>
          </div>
        </form>
      )}

      {/* LIVE EVENT PHOTO ALBUMS GRID */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((pt) => {
            const albumPhotos = pt.urls && pt.urls.length > 0 ? pt.urls : [pt.url];
            const photoCount = albumPhotos.length;

            return (
              <div
                key={pt.id}
                className="bg-[#241A13] border-2 border-[#D4AF37]/40 rounded-xl p-3 shadow-xl hover:border-[#D4AF37] transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Cover Image Container */}
                <div 
                  className="relative aspect-4/3 rounded-lg overflow-hidden bg-black mb-3 border border-[#D4AF37]/30 cursor-pointer"
                  onClick={() => handleOpenAlbum(pt)}
                >
                  <img
                    src={pt.url || albumPhotos[0]}
                    alt={pt.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Album Count Badge */}
                  {photoCount > 1 ? (
                    <div className="absolute top-2.5 right-2.5 bg-black/85 backdrop-blur-sm border border-[#D4AF37] text-[#D4AF37] text-[10px] font-bold font-typewriter px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                      <Layers className="w-3 h-3 text-[#D4AF37]" /> {photoCount} FOTO
                    </div>
                  ) : (
                    <div className="absolute top-2.5 right-2.5 bg-black/80 text-[#D4AF37] text-[10px] font-typewriter px-2 py-0.5 rounded border border-[#D4AF37]/30">
                      1 FOTO
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-black/80 border border-[#D4AF37] text-[#D4AF37] font-bold text-xs font-typewriter flex items-center gap-1.5 shadow-xl">
                      <Eye className="w-3.5 h-3.5" /> Buka Album ({photoCount})
                    </span>
                  </div>
                </div>

                <div className="px-1">
                  <p className="text-sm font-bold font-heading text-[#FAF0D7] line-clamp-2">
                    "{pt.caption}"
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-xs text-[#A89578] font-typewriter">
                    <span>Oleh: <strong className="text-[#D4AF37]">{pt.uploader}</strong></span>
                    
                    <button
                      onClick={() => handleOpenAlbum(pt)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1A1008] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3" /> Lihat Album
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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

      {/* RICH ALBUM CAROUSEL MODAL */}
      {activeAlbum && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative max-w-3xl w-full bg-[#241A13] border-2 border-[#D4AF37] rounded-2xl p-4 sm:p-6 shadow-[0_0_60px_rgba(212,175,55,0.6)] text-center flex flex-col max-h-[90vh]">
            <button
              onClick={() => setActiveAlbum(null)}
              className="absolute top-3 right-3 text-[#A89578] hover:text-white p-2 rounded-full border border-white/10 bg-black/40 z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Caption */}
            <div className="mb-3 pr-8">
              <h3 className="text-base sm:text-xl font-bold font-heading text-[#FAF0D7] line-clamp-1">
                "{activeAlbum.caption}"
              </h3>
              <p className="text-[11px] sm:text-xs text-[#D4AF37] font-typewriter mt-0.5">
                ALBUM OLEH: {activeAlbum.uploader} • GAMBAR {activePhotoIndex + 1} DARIPADA {(activeAlbum.urls || [activeAlbum.url]).length}
              </p>
            </div>

            {/* Main Carousel Image View */}
            {(() => {
              const currentUrls = activeAlbum.urls && activeAlbum.urls.length > 0 ? activeAlbum.urls : [activeAlbum.url];
              const currentImgUrl = currentUrls[activePhotoIndex] || currentUrls[0];
              const totalImgs = currentUrls.length;

              return (
                <>
                  <div className="relative flex-1 rounded-xl overflow-hidden bg-black border border-[#D4AF37]/50 flex items-center justify-center max-h-[50vh] my-2">
                    <img
                      src={currentImgUrl}
                      alt={`Foto ${activePhotoIndex + 1}`}
                      className="max-h-[50vh] w-auto max-w-full object-contain rounded-lg"
                    />

                    {/* Navigation Buttons for Multi-photo Album */}
                    {totalImgs > 1 && (
                      <>
                        <button
                          onClick={() => setActivePhotoIndex((prev) => (prev - 1 + totalImgs) % totalImgs)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/75 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer shadow-xl"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setActivePhotoIndex((prev) => (prev + 1) % totalImgs)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/75 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer shadow-xl"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Row Selector (If Album Has Multiple Photos) */}
                  {totalImgs > 1 && (
                    <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 my-1 max-w-full scrollbar-none">
                      {currentUrls.map((thumbUrl, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePhotoIndex(idx)}
                          className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                            activePhotoIndex === idx
                              ? 'border-[#D4AF37] scale-105 shadow-[0_0_10px_rgba(212,175,55,0.8)]'
                              : 'border-white/20 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={thumbUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Download Button */}
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => handleDownloadImage(currentImgUrl, `tokwan-album-${activeAlbum.uploader}-foto-${activePhotoIndex + 1}.jpg`)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#996515] text-black font-bold text-xs uppercase tracking-wider font-heading shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Muat Turun Foto Ini (Gambar {activePhotoIndex + 1}/{totalImgs})
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
