import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

// Check if variables are configured
const isConfigured = 
  !!firebaseConfig.apiKey && 
  !!firebaseConfig.storageBucket && 
  !!firebaseConfig.projectId;

let app: any;
let storage: any = null;
let analytics: any = null;

if (isConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    storage = getStorage(app);
    
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
} else {
  console.warn("Firebase credentials missing. Falling back to local/mock storage.");
}

/**
 * Uploads a file to Firebase Storage if configured.
 * Otherwise, falls back to generating a local Object URL.
 * 
 * @param file The file to upload
 * @param path The destination path in the storage bucket
 * @returns Promise resolving to the download URL
 */
export async function uploadFileToFirebase(file: File, path: string): Promise<string> {
  if (isConfigured && storage) {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Firebase upload failed, falling back to local URL:", error);
      return URL.createObjectURL(file);
    }
  } else {
    // Return a local Object URL for instant in-browser previews
    return URL.createObjectURL(file);
  }
}
