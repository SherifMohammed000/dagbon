import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, doc, setDoc, deleteDoc, getDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
let db: any = null;
let auth: any = null;
let googleProvider: any = null;
let analytics: any = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();

  // Initialize analytics only on the client side where it's supported
  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  }

  console.log("Firebase, Firestore & Auth initialized successfully.");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { db, auth, googleProvider };

/**
 * Trigger Google Popup Sign In and return user info
 */
export async function signInWithGoogleFirebase(): Promise<{ name: string; email: string; isAdmin: boolean }> {
  if (typeof window === "undefined" || !auth || !googleProvider) {
    throw new Error("Google Sign-In is unavailable on server side.");
  }
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const userData = {
    name: user.displayName || user.email?.split("@")[0] || "Google User",
    email: (user.email || "").toLowerCase(),
    isAdmin: user.email?.toLowerCase() === "admin@dagbon.com",
  };
  await saveUserToFirebase(userData);
  return userData;
}

/**
 * Saves or updates a user profile in Firebase Firestore under 'users' collection and local storage.
 */
export async function saveUserToFirebase(userData: {
  name: string;
  email: string;
  isAdmin: boolean;
  password?: string;
}): Promise<void> {
  const cleanEmail = userData.email.toLowerCase().trim();
  const cleanName = userData.name.trim();

  // 1. Save locally to dagbon_users
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("dagbon_users");
      const users: any[] = raw ? JSON.parse(raw) : [];
      const idx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
      if (idx >= 0) {
        users[idx] = { ...users[idx], name: cleanName, email: cleanEmail, isAdmin: userData.isAdmin, ...(userData.password ? { password: userData.password } : {}) };
      } else {
        users.push({ name: cleanName, email: cleanEmail, isAdmin: userData.isAdmin, ...(userData.password ? { password: userData.password } : {}) });
      }
      localStorage.setItem("dagbon_users", JSON.stringify(users));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to save user to local storage", e);
    }
  }

  // 2. Save to Firestore
  if (!db) {
    console.warn("Firestore database not initialized. Please ensure Firestore Database is created in Firebase Console.");
    return;
  }
  try {
    const docId = cleanEmail.replace(/[^a-z0-9]/g, "_");
    const userRef = doc(db, "users", docId);
    await setDoc(
      userRef,
      {
        name: cleanName,
        email: cleanEmail,
        isAdmin: userData.isAdmin,
        role: userData.isAdmin ? "Super Admin" : "Registered User",
        lastActive: new Date().toISOString(),
        ...(userData.password ? { password: userData.password } : {}),
      },
      { merge: true }
    );
    console.log(`User ${cleanEmail} successfully saved to Firebase Firestore (users/${docId}).`);
  } catch (error: any) {
    console.error("Firebase save user error:", error);
    if (error?.code === "permission-denied" || error?.message?.includes("permission")) {
      console.warn("Firestore permission-denied. Please check Rules tab in Firebase Console for project 'dagbon-her'.");
    }
  }
}

// ---------------------------------------------------------------------------
// Firestore Posts Engine (dual-persisted to Firestore & local storage)
// ---------------------------------------------------------------------------

export async function savePostToFirebase(post: {
  id?: string | number;
  title: string;
  category: string;
  body: string;
  status: string;
  author?: string;
  fileUrl?: string;
  date?: string;
}): Promise<string> {
  const docId = post.id ? String(post.id) : `${Date.now()}`;
  const data = {
    id: docId,
    title: post.title,
    category: post.category,
    body: post.body,
    status: post.status,
    author: post.author || "Admin",
    date: post.date || new Date().toISOString().split("T")[0],
    fileUrl: post.fileUrl || "",
    timestamp: post.id ? Number(post.id) : Date.now(),
  };

  // 1. Always save locally to dagbon_content so it's 100% visible immediately
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("dagbon_content");
      const list: any[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((p) => String(p.id) === docId);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...data };
      } else {
        list.unshift(data);
      }
      localStorage.setItem("dagbon_content", JSON.stringify(list));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Local storage post save error:", e);
    }
  }

  // 2. Save to Firebase Firestore
  if (db) {
    try {
      await setDoc(doc(db, "posts", docId), data, { merge: true });
      console.log(`Post "${post.title}" successfully saved to Firebase Firestore (posts/${docId}).`);
    } catch (e: any) {
      console.error("Firestore save post error:", e);
      if (e?.code === "permission-denied" || e?.message?.includes("permission")) {
        alert("Firebase Security Rules Warning: Cloud Firestore rejected writing the document due to security rules. Please go to your Firebase Console (dagbon-her) -> Firestore Database -> Rules tab, and update rules to:\n\nallow read, write: if true;");
      }
    }
  } else {
    console.warn("Firestore db instance is null. Make sure Cloud Firestore is created in Firebase Console.");
  }
  return docId;
}

export async function fetchPostsFromFirebase(): Promise<any[]> {
  if (!db) return [];
  try {
    const snapshot = await getDocs(collection(db, "posts"));
    const posts: any[] = [];
    snapshot.forEach((d) => posts.push(d.data()));
    posts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    return posts;
  } catch (e) {
    console.error("Firestore fetch posts error:", e);
    return [];
  }
}

export async function deletePostFromFirebase(id: string | number): Promise<void> {
  const docId = String(id);

  // 1. Delete locally
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("dagbon_content");
      if (raw) {
        const list: any[] = JSON.parse(raw);
        const updated = list.filter((p) => String(p.id) !== docId);
        localStorage.setItem("dagbon_content", JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));
      }
    } catch (e) {
      console.error("Local post delete error:", e);
    }
  }

  // 2. Delete from Firestore
  if (db) {
    try {
      await deleteDoc(doc(db, "posts", docId));
      console.log(`Post ${docId} deleted from Firebase Firestore.`);
    } catch (e) {
      console.error("Firestore delete post error:", e);
    }
  }
}

export function subscribePostsFromFirebase(callback: (posts: any[]) => void): () => void {
  const getLocalPosts = (): any[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("dagbon_content");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const mergePosts = (remotePosts: any[]): any[] => {
    const local = getLocalPosts();
    const map = new Map<string, any>();
    remotePosts.forEach((p) => map.set(String(p.id), p));
    local.forEach((p) => {
      if (!map.has(String(p.id))) {
        map.set(String(p.id), p);
      }
    });
    const combined = Array.from(map.values());
    combined.sort((a, b) => (b.timestamp || Number(b.id) || 0) - (a.timestamp || Number(a.id) || 0));
    return combined;
  };

  // Immediately callback with local items so UI renders instantaneously
  callback(getLocalPosts());

  if (!db) {
    return () => {};
  }

  try {
    const unsubscribe = onSnapshot(
      collection(db, "posts"),
      (snapshot) => {
        const remote: any[] = [];
        snapshot.forEach((d) => remote.push(d.data()));
        callback(mergePosts(remote));
      },
      (err) => {
        console.error("Firestore subscribe posts error:", err);
        callback(getLocalPosts());
      }
    );

    // Also listen to local storage changes
    if (typeof window !== "undefined") {
      const handleStorage = () => callback(getLocalPosts());
      window.addEventListener("storage", handleStorage);
    }

    return unsubscribe;
  } catch (e) {
    console.error("Firestore subscribe error:", e);
    callback(getLocalPosts());
    return () => {};
  }
}

/**
 * Fetches all registered users from Firebase Firestore.
 */
export async function fetchUsersFromFirebase(): Promise<any[]> {
  if (!db) return [];
  try {
    const snapshot = await getDocs(collection(db, "users"));
    const users: any[] = [];
    snapshot.forEach((d) => users.push(d.data()));
    return users;
  } catch (error) {
    console.error("Firebase fetch users error:", error);
    return [];
  }
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

