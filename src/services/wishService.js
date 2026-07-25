import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

const STORAGE_WISHES_KEY = 'tokwan_hasnul_wishes_v1';
const STORAGE_PHOTOS_KEY = 'tokwan_hasnul_event_photos_v1';
const STORAGE_MEMORIES_KEY = 'tokwan_hasnul_memories_v1';
const CHANNEL_NAME = 'tokwan_wishes_channel';

// Clean SVG Placeholder with white background and "EXAMPLE" text
const EXAMPLE_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23FFFFFF'/%3E%3Crect x='12' y='12' width='576' height='376' fill='none' stroke='%23D4AF37' stroke-width='4' stroke-dasharray='8 8'/%3E%3Ctext x='50%25' y='46%25' font-family='monospace' font-size='36' font-weight='bold' fill='%23222222' text-anchor='middle' dominant-baseline='middle'%3EEXAMPLE%3C/text%3E%3Ctext x='50%25' y='60%25' font-family='sans-serif' font-size='16' fill='%23777777' text-anchor='middle' dominant-baseline='middle'%3E[Muat Naik Foto Sebenar Di Sini]%3C/text%3E%3C/svg%3E";

const INITIAL_WISHES = [
  {
    id: 'sample-1',
    sender: 'Cucu-cucu Comel (Aiman & Sofea)',
    relationship: 'Cucu Kesayangan',
    message: 'Selamat Hari Jadi Ke-64 Tok Wan Hasnul! Tok Wan handsome macam P. Ramlee zaman Bujang Lapok! Semoga Tok Wan sentiasa sihat, dipanjangkan umur, dan ceria selalu bersama kami semua!',
    photo: EXAMPLE_PLACEHOLDER,
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    sticker: 'SENIMAN AGONG TOK WAN',
    likes: 12
  },
  {
    id: 'sample-2',
    sender: 'Along & Kak Long (Sekeluarga)',
    relationship: 'Anak Sulung',
    message: 'Happy 64th Birthday Abah Hasnul! Terima kasih kerana menjadi seorang abah dan Tok Wan yang paling hebat dan penyayang. Lagu P. Ramlee "Getaran Jiwa" sentiasa ingatkan kami pada kasih sayang abah!',
    photo: EXAMPLE_PLACEHOLDER,
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    sticker: 'TOK WAN PALING BEST',
    likes: 9
  },
  {
    id: 'sample-3',
    sender: 'Pak Ngah & Mak Ngah (Dari Penang)',
    relationship: 'Adik Beradik',
    message: 'Selamat Hari Jadi Hasnul yang ke-64! "Sedang Daku Asyik Menanti...", moga umur berkah, murah rezeki dan sihat sentiasa. Nanti balik Penang kita pekena Nasi Kandar fest!',
    photo: null,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    sticker: 'GENG KOPI VINTAJ',
    likes: 15
  }
];

const INITIAL_MEMORIES = [
  {
    id: 'mem-1',
    title: 'Zaman Muda Era 1980-an',
    year: '1982',
    caption: 'Tok Wan Hasnul di zaman muda.',
    url: EXAMPLE_PLACEHOLDER
  },
  {
    id: 'mem-2',
    title: 'Hari Persandingan Tok Wan & Tok',
    year: '1986',
    caption: 'Momen manis Tok Wan Hasnul & Nenek.',
    url: EXAMPLE_PLACEHOLDER
  },
  {
    id: 'mem-3',
    title: 'Hari Graduasi Anak Pertama',
    year: '2008',
    caption: 'Momen kejayaan anak-anak.',
    url: EXAMPLE_PLACEHOLDER
  },
  {
    id: 'mem-4',
    title: 'Sambutan Cucu Pertama',
    year: '2016',
    caption: 'Tok Wan bersama cucu-cucu.',
    url: EXAMPLE_PLACEHOLDER
  }
];

const INITIAL_EVENT_PHOTOS = [
  {
    id: 'evt-1',
    uploader: 'Mak Ngah',
    caption: 'Persediaan pentas P. Ramlee!',
    url: EXAMPLE_PLACEHOLDER,
    timestamp: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'evt-2',
    uploader: 'Cucu Aiman',
    caption: 'Kek Hari Jadi 64 Tahun Tok Wan!',
    url: EXAMPLE_PLACEHOLDER,
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
    const parsed = JSON.parse(data);
    return parsed.map(w => w.photo && w.photo.includes('unsplash') ? { ...w, photo: EXAMPLE_PLACEHOLDER } : w);
  } catch (err) {
    return INITIAL_WISHES;
  }
};

export const addWish = async (wishData) => {
  const newWish = {
    sender: wishData.sender || 'Tetamu Jemputan',
    relationship: wishData.relationship || 'Ahli Keluarga',
    message: wishData.message,
    photo: wishData.photo || null,
    sticker: wishData.sticker || 'SELAMAT HARI JADI',
    timestamp: new Date().toISOString(),
    likes: 0
  };

  // 1. Add to Firebase Firestore if configured
  if (isFirebaseConfigured()) {
    try {
      await addDoc(collection(db, 'wishes'), {
        ...newWish,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Firebase error adding wish:', err);
    }
  }

  // 2. Add to LocalStorage fallback
  const wishes = getStoredWishes();
  const wishWithId = { ...newWish, id: 'wish-' + Date.now() };
  const updatedWishes = [wishWithId, ...wishes];
  try {
    localStorage.setItem(STORAGE_WISHES_KEY, JSON.stringify(updatedWishes));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'NEW_WISH', wish: wishWithId, allWishes: updatedWishes });
    }
  } catch (err) {
    console.error('Failed to save local wish:', err);
  }

  return wishWithId;
};

// === TOK WAN MEMORIES ===
export const getTokWanMemories = () => {
  try {
    const data = localStorage.getItem(STORAGE_MEMORIES_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_MEMORIES_KEY, JSON.stringify(INITIAL_MEMORIES));
      return INITIAL_MEMORIES;
    }
    const parsed = JSON.parse(data);
    return parsed.map(m => m.url && m.url.includes('unsplash') ? { ...m, url: EXAMPLE_PLACEHOLDER } : m);
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
    const parsed = JSON.parse(data);
    return parsed.map(p => p.url && p.url.includes('unsplash') ? { ...p, url: EXAMPLE_PLACEHOLDER } : p);
  } catch (err) {
    return INITIAL_EVENT_PHOTOS;
  }
};

export const addEventPhoto = async (photoData) => {
  const newPhoto = {
    uploader: photoData.uploader || 'Tetamu Majlis',
    caption: photoData.caption || 'Koleksi Gambar Majlis Tok Wan',
    url: photoData.url,
    timestamp: new Date().toISOString()
  };

  // 1. Add to Firebase Firestore if configured
  if (isFirebaseConfigured()) {
    try {
      await addDoc(collection(db, 'event_photos'), {
        ...newPhoto,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Firebase error adding photo:', err);
    }
  }

  // 2. Add to LocalStorage fallback
  const photos = getEventPhotos();
  const photoWithId = { ...newPhoto, id: 'evt-' + Date.now() };
  const updatedPhotos = [photoWithId, ...photos];
  try {
    localStorage.setItem(STORAGE_PHOTOS_KEY, JSON.stringify(updatedPhotos));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'NEW_EVENT_PHOTO', photo: photoWithId, allPhotos: updatedPhotos });
    }
  } catch (err) {
    console.error('Failed to save local event photo:', err);
  }

  return photoWithId;
};

// === REALTIME SUBSCRIBER ===
export const subscribeToWishes = (callback) => {
  // If Firebase is configured, listen via Firestore Realtime
  if (isFirebaseConfigured()) {
    const qWishes = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
    const unsubWishes = onSnapshot(qWishes, (snapshot) => {
      const liveWishes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (liveWishes.length > 0) {
        callback(liveWishes, 'wishes');
      }
    });

    const qPhotos = query(collection(db, 'event_photos'), orderBy('createdAt', 'desc'));
    const unsubPhotos = onSnapshot(qPhotos, (snapshot) => {
      const livePhotos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (livePhotos.length > 0) {
        callback(livePhotos, 'photos');
      }
    });

    return () => {
      unsubWishes();
      unsubPhotos();
    };
  }

  // Fallback to BroadcastChannel & LocalStorage
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
