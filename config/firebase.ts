import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5CtkvJRwF8NhK0xEAoT39wxivSAgo4tU",
  authDomain: "medicationapp-8c3a7.firebaseapp.com",
  projectId: "medicationapp-8c3a7",
  storageBucket: "medicationapp-8c3a7.firebasestorage.app",
  messagingSenderId: "739488761134",
  appId: "1:739488761134:web:c0194bd0daf70b7b19e6bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth instance
export const auth = getAuth(app);
export default app; 