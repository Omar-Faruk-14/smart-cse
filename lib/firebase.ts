// Firebase Configuration Template for SmartCSE
// 
// To enable Firebase Authentication:
// 1. Create a Firebase project at https://console.firebase.google.com
// 2. Enable Authentication and Firestore in your Firebase project
// 3. Copy your Firebase config from Project Settings
// 4. Replace the placeholder values below with your actual Firebase config
// 5. Uncomment the code and install firebase: npm install firebase

/*
import { initializeApp, getApps } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth: Auth = getAuth(app)
export const db: Firestore = getFirestore(app)

export default app
*/

// Environment Variables Required:
// NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
// NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

// Firebase Authentication Methods you can use:
// - signInWithEmailAndPassword(auth, email, password) - Email/Password login
// - createUserWithEmailAndPassword(auth, email, password) - Create new user
// - signInWithPopup(auth, provider) - Social login (Google, GitHub, etc.)
// - signOut(auth) - Sign out user
// - sendPasswordResetEmail(auth, email) - Password reset
// - onAuthStateChanged(auth, callback) - Auth state listener

// Example usage in components:
/*
import { auth, db } from "@/lib/firebase"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"

// Login
const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

// Logout
const logout = async () => {
  await signOut(auth)
}

// Get user data from Firestore
const getUserData = async (userId: string) => {
  const userDoc = await getDoc(doc(db, "users", userId))
  return userDoc.data()
}
*/

export {}
