import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyAZ8-XwhcORTzYx9NruOeIE4lefDU56428",
  authDomain: "dagbon-her.firebaseapp.com",
  projectId: "dagbon-her",
  storageBucket: "dagbon-her.firebasestorage.app",
  messagingSenderId: "1004077845443",
  appId: "1:1004077845443:web:f8ae8738f5f88af0e0cb76",
  measurementId: "G-04Y384QH86"
};

let app: any;
let analytics: any = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  // Initialize analytics only on the client side where it's supported
  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  }

  console.log("Firebase initialized successfully.");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// ---------------------------------------------------------------------------
// IndexedDB-based file storage (replaces Firebase Storage uploads)
// ---------------------------------------------------------------------------
const DB_NAME = "dagbon_files";
const STORE_NAME = "uploads";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveBlob(key: string, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(blob, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadBlob(key: string): Promise<Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Uploads a file by storing it in IndexedDB.
 * Returns a custom URI in the form  idb://<key>  that can be resolved later
 * via getFileURL().
 */
export async function uploadFileToFirebase(file: File, path: string): Promise<string> {
  const key = `${path}`;
  await saveBlob(key, file);
  return `idb://${key}`;
}

// Cache of created object URLs so we don't create duplicates
const objectURLCache: Record<string, string> = {};

/**
 * Given a URL (which may be an idb:// URI, a blob:, an https://, or a data: URL),
 * returns a usable browser URL.  For idb:// URIs it loads the blob from IndexedDB
 * and creates an Object URL.
 */
export async function getFileURL(url: string): Promise<string> {
  if (!url) return "";

  // Already a normal URL
  if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  // IndexedDB reference
  if (url.startsWith("idb://")) {
    if (objectURLCache[url]) return objectURLCache[url];

    const key = url.slice(6); // strip "idb://"
    const blob = await loadBlob(key);
    if (blob) {
      const objURL = URL.createObjectURL(blob);
      objectURLCache[url] = objURL;
      return objURL;
    }
    return "";
  }

  return url;
}

