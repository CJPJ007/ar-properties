import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication
export const auth = getAuth(app);

// // Connect to auth emulator in development
// if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
//   // Only connect to emulator if not already connected
//   if (!auth.config.authDomain?.includes('localhost')) {
//     try {
//       connectAuthEmulator(auth, 'http://127.0.0.1:9099');
//     } catch (error) {
//       console.log('Auth emulator already connected or not available');
//     }
//   }
// }

export default app; 