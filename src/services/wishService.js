import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

// Version 2 Storage Keys
const STORAGE_WISHES_KEY = 'tokwan_hasnul_wishes_v2';
const STORAGE_PHOTOS_KEY = 'tokwan_hasnul_event_photos_v2';
const STORAGE_MEMORIES_KEY = 'tokwan_hasnul_memories_v2';
const CHANNEL_NAME = 'tokwan_wishes_channel_v2';

// SECURITY: Sanitize text to prevent XSS / Script Injection attacks
export const sanitizeText = (str, maxLength = 500) => {
  if (typeof str !== 'string') return '';
  // Strip HTML tags and script elements
  const cleanStr = str
    .replace(/<[^>]*>?/gm, '')
    .replace(/[<>"']/g, '')
    .trim();
  return cleanStr.substring(0, maxLength);
};

// SECURITY: Validate Image Data URL and limit max file payload (Max 5MB)
export const validateImageDataUrl = (dataUrl, maxSizeBytes = 5 * 1024 * 1024) => {
  if (!dataUrl) return null;
  if (typeof dataUrl !== 'string') return null;
  if (!dataUrl.startsWith('data:image/')) return null;
  
  // Approximate Base64 size check
  const stringLength = dataUrl.length - dataUrl.indexOf(',') - 1;
  const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896;
  if (sizeInBytes > maxSizeBytes) {
    throw new Error('Saiz gambar melebihi had keselamatan (Maksimum 5MB)');
  }
  return dataUrl;
};

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

// === WISHES CRUD ===
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
  // SECURITY: Sanitize all input fields
  const sanitizedSender = sanitizeText(wishData.sender || 'Tetamu Jemputan', 60);
  const sanitizedRel = sanitizeText(wishData.relationship || 'Ahli Keluarga', 50);
  const sanitizedMsg = sanitizeText(wishData.message, 500);
  const sanitizedSticker = sanitizeText(wishData.sticker || 'SELAMAT HARI JADI', 50);
  const validatedPhoto = validateImageDataUrl(wishData.photo);

  const newWish = {
    sender: sanitizedSender,
    relationship: sanitizedRel,
    message: sanitizedMsg,
    photo: validatedPhoto,
    sticker: sanitizedSticker,
    timestamp: new Date().toISOString(),
    likes: 0
  };

  let createdId = 'wish-' + Date.now();

  if (isFirebaseConfigured()) {
    try {
      const docRef = await addDoc(collection(db, 'wishes'), {
        ...newWish,
        createdAt: serverTimestamp()
      });
      createdId = docRef.id;
    } catch (err) {
      console.error('Firebase error adding wish:', err);
    }
  }

  const wishes = getStoredWishes();
  const wishWithId = { ...newWish, id: createdId };
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

export const deleteWish = async (id) => {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, 'wishes', id));
    } catch (err) {
      console.error('Firebase error deleting wish:', err);
    }
  }

  const wishes = getStoredWishes();
  const updatedWishes = wishes.filter(w => w.id !== id);
  try {
    localStorage.setItem(STORAGE_WISHES_KEY, JSON.stringify(updatedWishes));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'DELETE_WISH', id, allWishes: updatedWishes });
    }
  } catch (e) {}
  return updatedWishes;
};

export const updateWish = async (id, updatedFields) => {
  const sanitizedFields = {};
  if (updatedFields.sender) sanitizedFields.sender = sanitizeText(updatedFields.sender, 60);
  if (updatedFields.relationship) sanitizedFields.relationship = sanitizeText(updatedFields.relationship, 50);
  if (updatedFields.message) sanitizedFields.message = sanitizeText(updatedFields.message, 500);
  if (updatedFields.sticker) sanitizedFields.sticker = sanitizeText(updatedFields.sticker, 50);

  if (isFirebaseConfigured()) {
    try {
      await updateDoc(doc(db, 'wishes', id), sanitizedFields);
    } catch (err) {
      console.error('Firebase error updating wish:', err);
    }
  }

  const wishes = getStoredWishes();
  const updatedWishes = wishes.map(w => w.id === id ? { ...w, ...sanitizedFields } : w);
  try {
    localStorage.setItem(STORAGE_WISHES_KEY, JSON.stringify(updatedWishes));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'UPDATE_WISH', id, allWishes: updatedWishes });
    }
  } catch (e) {}
  return updatedWishes;
};

// === TOK WAN MEMORIES CRUD ===
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

export const addTokWanMemory = (memoryData) => {
  const memories = getTokWanMemories();
  const newMem = {
    id: 'mem-' + Date.now(),
    title: sanitizeText(memoryData.title || 'Memori Tok Wan', 100),
    year: sanitizeText(memoryData.year || '2026', 10),
    caption: sanitizeText(memoryData.caption || '', 300),
    url: validateImageDataUrl(memoryData.url)
  };
  const updated = [newMem, ...memories];
  try {
    localStorage.setItem(STORAGE_MEMORIES_KEY, JSON.stringify(updated));
  } catch (e) {}
  return newMem;
};

export const deleteTokWanMemory = (id) => {
  const memories = getTokWanMemories();
  const updated = memories.filter(m => m.id !== id);
  try {
    localStorage.setItem(STORAGE_MEMORIES_KEY, JSON.stringify(updated));
  } catch (e) {}
  return updated;
};

// === LIVE EVENT PHOTOS CRUD ===
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
  const sanitizedUploader = sanitizeText(photoData.uploader || 'Tetamu Majlis', 60);
  const sanitizedCaption = sanitizeText(photoData.caption || 'Koleksi Gambar Majlis Tok Wan', 200);
  const validatedUrl = validateImageDataUrl(photoData.url);

  const newPhoto = {
    uploader: sanitizedUploader,
    caption: sanitizedCaption,
    url: validatedUrl,
    timestamp: new Date().toISOString()
  };

  let createdId = 'evt-' + Date.now();

  if (isFirebaseConfigured()) {
    try {
      const docRef = await addDoc(collection(db, 'event_photos'), {
        ...newPhoto,
        createdAt: serverTimestamp()
      });
      createdId = docRef.id;
    } catch (err) {
      console.error('Firebase error adding photo:', err);
    }
  }

  const photos = getEventPhotos();
  const photoWithId = { ...newPhoto, id: createdId };
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

export const deleteEventPhoto = async (id) => {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, 'event_photos', id));
    } catch (err) {
      console.error('Firebase error deleting event photo:', err);
    }
  }

  const photos = getEventPhotos();
  const updatedPhotos = photos.filter(p => p.id !== id);
  try {
    localStorage.setItem(STORAGE_PHOTOS_KEY, JSON.stringify(updatedPhotos));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'DELETE_EVENT_PHOTO', id, allPhotos: updatedPhotos });
    }
  } catch (e) {}
  return updatedPhotos;
};

export const updateEventPhoto = async (id, updatedFields) => {
  const sanitizedFields = {};
  if (updatedFields.uploader) sanitizedFields.uploader = sanitizeText(updatedFields.uploader, 60);
  if (updatedFields.caption) sanitizedFields.caption = sanitizeText(updatedFields.caption, 200);

  if (isFirebaseConfigured()) {
    try {
      await updateDoc(doc(db, 'event_photos', id), sanitizedFields);
    } catch (err) {
      console.error('Firebase error updating photo:', err);
    }
  }

  const photos = getEventPhotos();
  const updatedPhotos = photos.map(p => p.id === id ? { ...p, ...sanitizedFields } : p);
  try {
    localStorage.setItem(STORAGE_PHOTOS_KEY, JSON.stringify(updatedPhotos));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'UPDATE_EVENT_PHOTO', id, allPhotos: updatedPhotos });
    }
  } catch (e) {}
  return updatedPhotos;
};

// Realtime Subscriber
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
    if (event.data && event.data.allWishes) {
      callback(event.data.allWishes, 'wishes');
    }
    if (event.data && event.data.allPhotos) {
      callback(event.data.allPhotos, 'photos');
    }
  };

  broadcastChannel.addEventListener('message', handleMessage);
  return () => {
    broadcastChannel.removeEventListener('message', handleMessage);
  };
};
