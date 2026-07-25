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

// Empty Initial Arrays (No Dummy Data)
const INITIAL_WISHES = [];
const INITIAL_MEMORIES = [];
const INITIAL_EVENT_PHOTOS = [];

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

export const addEventPhoto = async (photoData) => {
  const newPhoto = {
    uploader: photoData.uploader || 'Tetamu Majlis',
    caption: photoData.caption || 'Koleksi Gambar Majlis Tok Wan',
    url: photoData.url,
    timestamp: new Date().toISOString()
  };

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

// Clear localStorage items to remove previous local dummy data
export const resetLocalData = () => {
  try {
    localStorage.removeItem(STORAGE_WISHES_KEY);
    localStorage.removeItem(STORAGE_PHOTOS_KEY);
    localStorage.removeItem(STORAGE_MEMORIES_KEY);
  } catch (e) {}
};

export const subscribeToWishes = (callback) => {
  if (isFirebaseConfigured()) {
    const qWishes = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
    const unsubWishes = onSnapshot(qWishes, (snapshot) => {
      const liveWishes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(liveWishes, 'wishes');
    });

    const qPhotos = query(collection(db, 'event_photos'), orderBy('createdAt', 'desc'));
    const unsubPhotos = onSnapshot(qPhotos, (snapshot) => {
      const livePhotos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(livePhotos, 'photos');
    });

    return () => {
      unsubWishes();
      unsubPhotos();
    };
  }

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
