import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDz-uZwomWamI4NuevZ0FE09aY3HdxZkBA",
  authDomain: "home-bills-manager-31cde.firebaseapp.com",
  projectId: "home-bills-manager-31cde",
  storageBucket: "home-bills-manager-31cde.firebasestorage.app",
  messagingSenderId: "320799228378",
  appId: "1:320799228378:web:4d22bb9bdf228d70ca00e3"
};
// Validates whether genuine credentials (not placeholders) have been provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR_ACTUAL_API_KEY" &&
  firebaseConfig.apiKey !== "your_api_key_here" &&
  !firebaseConfig.apiKey.includes("YOUR_ACTUAL") &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "YOUR_ACTUAL_PROJECT_ID" &&
  firebaseConfig.projectId !== "your-project-id" &&
  !firebaseConfig.projectId.includes("YOUR_ACTUAL")
);

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Failed to initialize Firebase SDK:", error);
  }
} else {
  console.warn(
    "Firebase credentials are still placeholder values. " +
    "Please replace YOUR_ACTUAL_API_KEY with your real credentials in .env or src/firebase.js to fetch data."
  );
}

export { app, auth, db };
export default app;
