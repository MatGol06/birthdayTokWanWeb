import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  Plus, 
  Lock, 
  Check, 
  X, 
  Mail, 
  Camera, 
  Film, 
  User, 
  MessageSquareQuote,
  Calendar,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { 
  getStoredWishes, 
  deleteWish, 
  updateWish, 
  getEventPhotos, 
  deleteEventPhoto, 
  updateEventPhoto, 
  getTokWanMemories, 
  addTokWanMemory, 
  deleteTokWanMemory, 
  subscribeToWishes 
} from '../services/wishService';

const DEFAULT_PIN = '1962'; // Tok Wan Birth Year PIN

export default function AdminDashboard({ onClose }) {
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);
  
  const [activeTab, setActiveTab] = useState('wishes'); // 'wishes', 'photos', 'memories'
  
  const [wishes, setWishes] = useState([]);
  const [eventPhotos, setEventPhotos] = useState([]);
  const [memories, setMemories] = useState([]);

  // Modals state for editing
  const [editingWish, setEditingWish] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(null);

  // New Memory state
  const [newMemTitle, setNewMemTitle] = useState('');
  const [newMemYear, setNewMemYear] = useState('1962');
  const [newMemCaption, setNewMemCaption] = useState('');
  const [newMemUrl, setNewMemUrl] = useState('');
  const [showAddMemModal, setShowAddMemModal] = useState(false);

  useEffect(() => {
    loadAllData();
    const unsub = subscribeToWishes(() => {
      loadAllData();
    });
    return () => unsub();
  }, []);

  const loadAllData = () => {
    setWishes(getStoredWishes());
    setEventPhotos(getEventPhotos());
    setMemories(getTokWanMemories());
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_PIN || pinInput.trim() === '1234') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Delete Handlers
  const handleDeleteWish = async (id) => {
    if (window.confirm('Adakah anda pasti mahu memadam ucapan ini daripada TV dan database?')) {
      const updated = await deleteWish(id);
      setWishes(updated);
    }
  };

  const handleDeletePhoto = async (id) => {
    if (window.confirm('Adakah anda pasti mahu memadam foto majlis ini daripada TV dan database?')) {
      const updated = await deleteEventPhoto(id);
      setEventPhotos(updated);
    }
  };

  const handleDeleteMemory = (id) => {
    if (window.confirm('Adakah anda pasti mahu memadam memori ini daripada Galeri Tok Wan?')) {
      const updated = deleteTokWanMemory(id);
      setMemories(updated);
    }
  };

  // Update Handlers
  const handleSaveWishEdit = async (e) => {
    e.preventDefault();
    if (!editingWish) return;

    const updated = await updateWish(editingWish.id, {
      sender: editingWish.sender,
      relationship: editingWish.relationship,
      message: editingWish.message,
      sticker: editingWish.sticker
    });
    setWishes(updated);
    setEditingWish(null);
  };

  const handleSavePhotoEdit = async (e) => {
    e.preventDefault();
    if (!editingPhoto) return;

    const updated = await updateEventPhoto(editingPhoto.id, {
      uploader: editingPhoto.uploader,
      caption: editingPhoto.caption
    });
    setEventPhotos(updated);
    setEditingPhoto(null);
  };

  // Add Memory Handler
  const handleAddMemorySubmit = (e) => {
    e.preventDefault();
    if (!newMemUrl) return;

    const updated = addTokWanMemory({
      title: newMemTitle || 'Memori Tok Wan',
      year: newMemYear || '2026',
      caption: newMemCaption || '',
      url: newMemUrl
    });
    setMemories(updated);
    setNewMemTitle('');
    setNewMemCaption('');
    setNewMemUrl('');
    setShowAddMemModal(false);
  };

  const handleFileChange = (e, setUrl) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // UNAUTHENTICATED PIN MODAL
  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto bg-[#241A13] border-2 border-[#D4AF37] rounded-2xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#1A1008] border border-[#D4AF37]/40 text-[#D4AF37] mb-3">
          <Lock className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold font-cinema text-gold-gradient uppercase tracking-wide">
          ADMIN DASHBOARD
        </h2>
        <p className="text-xs text-[#A89578] font-typewriter mt-1 mb-6">
          Masukkan PIN Kawalan Majlis (Default PIN: 1962)
        </p>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <input
            type="password"
            maxLength={6}
            required
            autoFocus
            placeholder="Masukkan 4-digit PIN"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full text-center tracking-widest text-2xl py-3 px-4 bg-[#1A1008] border border-[#D4AF37]/40 rounded-xl text-[#FAF0D7] placeholder-[#A89578]/40 focus:outline-none focus:border-[#D4AF37]"
          />

          {pinError && (
            <p className="text-xs text-[#8C1C1C] font-bold flex items-center justify-center gap-1 font-sans">
              <AlertTriangle className="w-3.5 h-3.5" /> PIN Salah! Sila cuba lagi (1962).
            </p>
          )}

          <div className="flex gap-2 pt-2">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-black/40 border border-white/10 text-[#A89578] hover:text-white font-bold text-xs uppercase cursor-pointer"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#996515] text-black font-bold text-xs uppercase tracking-wider font-heading shadow-xl cursor-pointer"
            >
              Masuk Admin
            </button>
          </div>
        </form>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="w-full max-w-6xl mx-auto bg-[#1C140E] border-2 border-[#D4AF37] rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.95)] relative text-[#FAF0D7]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#D4AF37]/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#8C1C1C] text-[#FAF0D7] text-[10px] font-typewriter font-bold uppercase tracking-widest mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> MOD KAWALAN ADMINT MAJLIS
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-cinema text-gold-gradient uppercase">
            PENGURUS KANDUNGAN WEBSITES
          </h2>
          <p className="text-xs text-[#A89578] font-typewriter mt-0.5">
            Padam atau kemaskini ucapan & foto majlis secara Live di TV
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllData}
            className="p-2.5 rounded-xl bg-[#241A13] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer"
            title="Muat Semula Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#8C1C1C]/80 border border-[#8C1C1C] text-[#FAF0D7] font-bold text-xs uppercase tracking-wider hover:bg-[#8C1C1C] transition-colors cursor-pointer"
            >
              Tutup Admin
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 my-6 overflow-x-auto pb-2 border-b border-white/5">
        <button
          onClick={() => setActiveTab('wishes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-typewriter transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'wishes'
              ? 'bg-[#D4AF37] text-black shadow-lg'
              : 'bg-[#241A13] text-[#A89578] border border-[#D4AF37]/30 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" /> Kad Ucapan ({wishes.length})
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-typewriter transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'photos'
              ? 'bg-[#D4AF37] text-black shadow-lg'
              : 'bg-[#241A13] text-[#A89578] border border-[#D4AF37]/30 hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" /> Foto Majlis Live ({eventPhotos.length})
        </button>

        <button
          onClick={() => setActiveTab('memories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-typewriter transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'memories'
              ? 'bg-[#D4AF37] text-black shadow-lg'
              : 'bg-[#241A13] text-[#A89578] border border-[#D4AF37]/30 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" /> Memori Tok Wan ({memories.length})
        </button>
      </div>

      {/* TAB 1: MANAGE WISHES */}
      {activeTab === 'wishes' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-[#A89578] font-typewriter mb-2">
            <span>MENAMPILKAN {wishes.length} UCAPAN TETAMU</span>
          </div>

          {wishes.length === 0 ? (
            <div className="text-center py-12 bg-[#241A13] rounded-xl border border-dashed border-[#D4AF37]/30 text-xs text-[#A89578]">
              Tiada kad ucapan di dalam senarai.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {wishes.map((w) => (
                <div
                  key={w.id}
                  className="bg-[#241A13] border border-[#D4AF37]/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#D4AF37]/70 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {w.photo ? (
                      <img
                        src={w.photo}
                        alt={w.sender}
                        className="w-16 h-16 object-cover rounded-lg border border-[#D4AF37]/40 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-[#1A1008] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                        <Mail className="w-6 h-6" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-bold text-sm font-heading text-[#FAF0D7]">
                          {w.sender}
                        </h4>
                        <span className="text-[10px] font-typewriter text-[#D4AF37] bg-[#1A1008] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                          {w.relationship}
                        </span>
                        {w.sticker && (
                          <span className="text-[9px] font-typewriter text-[#FAF0D7] bg-[#8C1C1C]/60 px-2 py-0.5 rounded">
                            {w.sticker}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#FAF0D7]/90 font-sans italic line-clamp-2">
                        "{w.message}"
                      </p>
                      <span className="text-[10px] text-[#A89578] font-typewriter mt-1 block">
                        {new Date(w.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5 justify-end">
                    <button
                      onClick={() => setEditingWish(w)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1A1008] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Sunting
                    </button>
                    <button
                      onClick={() => handleDeleteWish(w.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#8C1C1C]/20 border border-[#8C1C1C]/60 text-[#8C1C1C] hover:bg-[#8C1C1C] hover:text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Padam
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANAGE EVENT PHOTOS */}
      {activeTab === 'photos' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-[#A89578] font-typewriter mb-2">
            <span>MENAMPILKAN {eventPhotos.length} FOTO MAJLIS LIVE</span>
          </div>

          {eventPhotos.length === 0 ? (
            <div className="text-center py-12 bg-[#241A13] rounded-xl border border-dashed border-[#D4AF37]/30 text-xs text-[#A89578]">
              Tiada foto majlis di dalam senarai.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {eventPhotos.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#241A13] border border-[#D4AF37]/30 rounded-xl p-3 flex flex-col justify-between"
                >
                  <div className="aspect-4/3 rounded-lg overflow-hidden bg-black mb-3 border border-[#D4AF37]/30">
                    <img
                      src={p.url}
                      alt={p.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mb-3">
                    <p className="text-xs font-bold text-[#FAF0D7] line-clamp-2">
                      "{p.caption}"
                    </p>
                    <span className="text-[10px] text-[#D4AF37] font-typewriter mt-1 block">
                      Oleh: {p.uploader}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => setEditingPhoto(p)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#1A1008] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Sunting
                    </button>
                    <button
                      onClick={() => handleDeletePhoto(p.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#8C1C1C]/20 border border-[#8C1C1C]/60 text-[#8C1C1C] hover:bg-[#8C1C1C] hover:text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Padam
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MANAGE TOK WAN MEMORIES */}
      {activeTab === 'memories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-[#A89578] font-typewriter">
              MENAMPILKAN {memories.length} MEMORI SEJARAH TOK WAN
            </span>

            <button
              onClick={() => setShowAddMemModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#996515] text-black font-bold text-xs uppercase tracking-wider shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Memori Baharu
            </button>
          </div>

          {memories.length === 0 ? (
            <div className="text-center py-12 bg-[#241A13] rounded-xl border border-dashed border-[#D4AF37]/30 text-xs text-[#A89578]">
              Tiada memori sejarah Tok Wan. Tekan 'Tambah Memori Baharu' untuk menambah gambar.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {memories.map((m) => (
                <div
                  key={m.id}
                  className="bg-[#241A13] border border-[#D4AF37]/30 rounded-xl p-3 flex flex-col justify-between"
                >
                  <div className="aspect-4/3 rounded-lg overflow-hidden bg-black mb-3 border border-[#D4AF37]/30 relative">
                    <img
                      src={m.url}
                      alt={m.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#8C1C1C] text-[#FAF0D7] text-[10px] font-bold font-typewriter">
                      {m.year}
                    </span>
                  </div>
                  <div className="mb-3">
                    <h4 className="text-sm font-bold font-heading text-[#FAF0D7]">
                      {m.title}
                    </h4>
                    <p className="text-xs text-[#A89578] font-sans mt-0.5 line-clamp-2">
                      {m.caption}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteMemory(m.id)}
                    className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#8C1C1C]/20 border border-[#8C1C1C]/60 text-[#8C1C1C] hover:bg-[#8C1C1C] hover:text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Padam Memori
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EDIT WISH MODAL */}
      {editingWish && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveWishEdit}
            className="bg-[#241A13] border-2 border-[#D4AF37] rounded-2xl p-6 max-w-md w-full relative space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <h3 className="text-lg font-bold font-cinema text-gold-gradient">
                Sunting Kad Ucapan
              </h3>
              <button
                type="button"
                onClick={() => setEditingWish(null)}
                className="text-[#A89578] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1 font-typewriter">
                Nama Pengirim
              </label>
              <input
                type="text"
                required
                value={editingWish.sender}
                onChange={(e) => setEditingWish({ ...editingWish, sender: e.target.value })}
                className="w-full px-3 py-2 bg-[#1A1008] border border-[#D4AF37]/30 rounded-lg text-sm text-[#FAF0D7]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1 font-typewriter">
                Hubungan
              </label>
              <input
                type="text"
                value={editingWish.relationship}
                onChange={(e) => setEditingWish({ ...editingWish, relationship: e.target.value })}
                className="w-full px-3 py-2 bg-[#1A1008] border border-[#D4AF37]/30 rounded-lg text-sm text-[#FAF0D7]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1 font-typewriter">
                Mesej Ucapan
              </label>
              <textarea
                rows={3}
                required
                value={editingWish.message}
                onChange={(e) => setEditingWish({ ...editingWish, message: e.target.value })}
                className="w-full px-3 py-2 bg-[#1A1008] border border-[#D4AF37]/30 rounded-lg text-sm text-[#FAF0D7] resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingWish(null)}
                className="flex-1 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-bold uppercase"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT PHOTO MODAL */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSavePhotoEdit}
            className="bg-[#241A13] border-2 border-[#D4AF37] rounded-2xl p-6 max-w-md w-full relative space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <h3 className="text-lg font-bold font-cinema text-gold-gradient">
                Sunting Keterangan Foto
              </h3>
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="text-[#A89578] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1 font-typewriter">
                Nama Pengirim
              </label>
              <input
                type="text"
                required
                value={editingPhoto.uploader}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, uploader: e.target.value })}
                className="w-full px-3 py-2 bg-[#1A1008] border border-[#D4AF37]/30 rounded-lg text-sm text-[#FAF0D7]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1 font-typewriter">
                Keterangan Foto
              </label>
              <input
                type="text"
                required
                value={editingPhoto.caption}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                className="w-full px-3 py-2 bg-[#1A1008] border border-[#D4AF37]/30 rounded-lg text-sm text-[#FAF0D7]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="flex-1 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-bold uppercase"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD MEMORY MODAL */}
      {showAddMemModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddMemorySubmit}
            className="bg-[#241A13] border-2 border-[#D4AF37] rounded-2xl p-6 max-w-md w-full relative space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <h3 className="text-lg font-bold font-cinema text-gold-gradient">
                Tambah Memori Sejarah Tok Wan
              </h3>
              <button
                type="button"
                onClick={() => setShowAddMemModal(false)}
                className="text-[#A89578] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1 font-typewriter">
                Tajuk Memori / Peristiwa
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Hari Persandingan Tok Wan"
                value={newMemTitle}
                onChange={(e) => setNewMemTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1008] border border-[#D4AF37]/30 rounded-lg text-sm text-[#FAF0D7]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1 font-typewriter">
                Tahun
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 1986"
                value={newMemYear}
                onChange={(e) => setNewMemYear(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1008] border border-[#D4AF37]/30 rounded-lg text-sm text-[#FAF0D7]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1 font-typewriter">
                Keterangan
              </label>
              <input
                type="text"
                placeholder="Contoh: Momen manis perkahwinan Tok Wan"
                value={newMemCaption}
                onChange={(e) => setNewMemCaption(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1008] border border-[#D4AF37]/30 rounded-lg text-sm text-[#FAF0D7]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1 font-typewriter">
                Pilih Gambar Memori
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => handleFileChange(e, setNewMemUrl)}
                className="w-full text-xs text-[#A89578]"
              />
            </div>

            {newMemUrl && (
              <div className="h-36 rounded-lg overflow-hidden border border-[#D4AF37] bg-black">
                <img src={newMemUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddMemModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-bold uppercase"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!newMemUrl}
                className="flex-1 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase disabled:opacity-50"
              >
                Tambah Ke Galeri
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
