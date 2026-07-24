// Wish & Event Photo Management Service with LocalStorage & BroadcastChannel Live Sync

const STORAGE_WISHES_KEY = 'tokwan_hasnul_wishes_v1';
const STORAGE_PHOTOS_KEY = 'tokwan_hasnul_event_photos_v1';
const STORAGE_MEMORIES_KEY = 'tokwan_hasnul_memories_v1';
const CHANNEL_NAME = 'tokwan_wishes_channel';

// Preset sample wishes celebrating Tok Wan Hasnul's 64th Birthday
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
  }
];

// Preset Memories of Tok Wan Hasnul (Life Timeline Gallery)
const INITIAL_MEMORIES = [
  {
    id: 'mem-1',
    title: 'Zaman Muda Era 1980-an',
    year: '1982',
    caption: 'Tok Wan Hasnul di zaman muda bergaya klasik macam bintang filem!',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Hari Persandingan Tok Wan & Tok',
    year: '1986',
    caption: 'Momen manis perkhidmatan cinta sejati Tok Wan Hasnul & Nenek.',
    id: 'mem-2',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Hari Graduasi Anak Pertama',
    year: '2008',
    caption: 'Bangga melimpah dalam dada melihat kejayaan anak-anak.',
    id: 'mem-3',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Perkhidmatan & Sambutan Cucu Pertama',
    year: '2016',
    caption: 'Rasmi menjadi Tok Wan kesayangan cucu-cucu!',
    id: 'mem-4',
    url: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80'
  }
];

// Preset Sample Live Event Photos (Photos taken by guests during celebration)
const INITIAL_EVENT_PHOTOS = [
  {
    id: 'evt-1',
    uploader: 'Mak Ngah',
    caption: 'Persediaan pentas P. Ramlee cantik sangat! Tak sabar majlis mula!',
    url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    timestamp: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'evt-2',
    uploader: 'Cucu Aiman',
    caption: 'Kek Hari Jadi 64 Tahun Tok Wan bertema piring hitam!',
    url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    timestamp: new Date(Date.now() - 900000).toISOString()
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

// === WISHES ===
export const getStoredWishes = () => {
  try {
    const data = localStorage.getItem(STORAGE_WISHES_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_WISHES_KEY, JSON.stringify(INITIAL_WISHES));
      return INITIAL_WISHES;
    }
    return JSON.parse(data);
  } catch (err) {
    return INITIAL_WISHES;
  }
};

export const addWish = (wishData) => {
  const wishes = getStoredWishes();
  const newWish = {
    id: 'wish-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    sender: wishData.sender || 'Tetamu Jemputan',
    relationship: wishData.relationship || 'Ahli Keluarga',
    message: wishData.message,
    photo: wishData.photo || null,
    timestamp: new Date().toISOString(),
    sticker: wishData.sticker || '🎂 Selamat Hari Jadi',
    likes: 0
  };

  const updatedWishes = [newWish, ...wishes];
  try {
    localStorage.setItem(STORAGE_WISHES_KEY, JSON.stringify(updatedWishes));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'NEW_WISH', wish: newWish, allWishes: updatedWishes });
    }
  } catch (err) {
    console.error('Failed to save wish:', err);
  }
  return newWish;
};

// === TOK WAN MEMORIES ===
export const getTokWanMemories = () => {
  try {
    const data = localStorage.getItem(STORAGE_MEMORIES_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_MEMORIES_KEY, JSON.stringify(INITIAL_MEMORIES));
      return INITIAL_MEMORIES;
    }
    return JSON.parse(data);
  } catch (err) {
    return INITIAL_MEMORIES;
  }
};

// === LIVE EVENT PHOTOS ===
export const getEventPhotos = () => {
  try {
    const data = localStorage.getItem(STORAGE_PHOTOS_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_PHOTOS_KEY, JSON.stringify(INITIAL_EVENT_PHOTOS));
      return INITIAL_EVENT_PHOTOS;
    }
    return JSON.parse(data);
  } catch (err) {
    return INITIAL_EVENT_PHOTOS;
  }
};

export const addEventPhoto = (photoData) => {
  const photos = getEventPhotos();
  const newPhoto = {
    id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    uploader: photoData.uploader || 'Tetamu Majlis',
    caption: photoData.caption || 'Koleksi Gambar Majlis Tok Wan',
    url: photoData.url,
    timestamp: new Date().toISOString()
  };

  const updatedPhotos = [newPhoto, ...photos];
  try {
    localStorage.setItem(STORAGE_PHOTOS_KEY, JSON.stringify(updatedPhotos));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'NEW_EVENT_PHOTO', photo: newPhoto, allPhotos: updatedPhotos });
    }
  } catch (err) {
    console.error('Failed to save event photo:', err);
  }
  return newPhoto;
};

export const subscribeToWishes = (callback) => {
  if (!broadcastChannel) return () => {};

  const handleMessage = (event) => {
    if (event.data && event.data.type === 'NEW_WISH') {
      callback(event.data.allWishes, 'wishes');
    } else if (event.data && event.data.type === 'NEW_EVENT_PHOTO') {
      callback(event.data.allPhotos, 'photos');
    }
  };

  broadcastChannel.addEventListener('message', handleMessage);
  return () => {
    broadcastChannel.removeEventListener('message', handleMessage);
  };
};
