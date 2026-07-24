// Wish Management Service with LocalStorage & BroadcastChannel for Live Sync

const STORAGE_KEY = 'tokwan_hasnul_wishes_v1';
const CHANNEL_NAME = 'tokwan_wishes_channel';

// Preset sample wishes celebrating Tok Wan Hasnul's 64th Birthday with classic P. Ramlee humor & love
const INITIAL_WISHES = [
  {
    id: 'sample-1',
    sender: 'Cucu-cucu Comel (Aiman & Sofea)',
    relationship: 'Cucu Kesayangan',
    message: 'Selamat Hari Jadi Ke-64 Tok Wan Hasnul! Tok Wan handsome macam P. Ramlee zaman Bujang Lapok! Semoga Tok Wan sentiasa sihat, dipanjangkan umur, dan ceria selalu bersama kami semua! ❤️🎬',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    sticker: '🌟 Seniman Agong Tok Wan',
    likes: 12
  },
  {
    id: 'sample-2',
    sender: 'Along & Kak Long (Sekeluarga)',
    relationship: 'Anak Sulung',
    message: 'Happy 64th Birthday Abah Hasnul! Terima kasih kerana menjadi seorang abah dan Tok Wan yang paling hebat dan penyayang. Lagu P. Ramlee "Getaran Jiwa" sentiasa ingatkan kami pada kasih sayang abah!',
    photo: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    sticker: '👑 Tok Wan Paling Best',
    likes: 9
  },
  {
    id: 'sample-3',
    sender: 'Pak Ngah & Mak Ngah (Dari Penang)',
    relationship: 'Adik Beradik',
    message: 'Selamat Hari Jadi Hasnul yang ke-64! "Sedang Daku Asyik Menanti...", moga umur berkah, murah rezeki dan sihat sentiasa. Nanti balik Penang kita pekena Nasi Kandar fest!',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    sticker: '☕ Geng Kopi Vintaj',
    likes: 15
  },
  {
    id: 'sample-4',
    sender: 'Mamak Labu & Labi',
    relationship: 'Sahabat Lama',
    message: 'Selamat Hari Lahir Hasnul Mansor! Makin meningkat umur makin berkarisma. Macam P. Ramlee kata: "Siapa tak sayang bini oii...", tapi Tok Wan sayang semua cucu-cucu!',
    photo: null,
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    sticker: '🎩 Legend Klasik',
    likes: 7
  }
];

let broadcastChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel not supported', e);
  }
}

export const getStoredWishes = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_WISHES));
      return INITIAL_WISHES;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read wishes:', err);
    return INITIAL_WISHES;
  }
};

export const addWish = (wishData) => {
  const wishes = getStoredWishes();
  const newWish = {
    id: 'wish-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    sender: wishData.sender || 'Hamba Allah',
    relationship: wishData.relationship || 'Ahli Keluarga',
    message: wishData.message,
    photo: wishData.photo || null,
    timestamp: new Date().toISOString(),
    sticker: wishData.sticker || '🎂 Selamat Hari Jadi',
    likes: 0
  };

  const updatedWishes = [newWish, ...wishes];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWishes));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'NEW_WISH', wish: newWish, allWishes: updatedWishes });
    }
  } catch (err) {
    console.error('Failed to save wish:', err);
  }

  return newWish;
};

export const subscribeToWishes = (callback) => {
  if (!broadcastChannel) return () => {};

  const handleMessage = (event) => {
    if (event.data && event.data.allWishes) {
      callback(event.data.allWishes);
    }
  };

  broadcastChannel.addEventListener('message', handleMessage);

  return () => {
    broadcastChannel.removeEventListener('message', handleMessage);
  };
};
