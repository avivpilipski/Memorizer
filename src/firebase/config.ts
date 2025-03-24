// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Uncomment if you need analytics in a client component
// import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARGrU5flae6Ilzjbl3TwP8qDf0ye2-xZE",
  authDomain: "memorizer-1149c.firebaseapp.com",
  projectId: "memorizer-1149c",
  storageBucket: "memorizer-1149c.firebasestorage.app",
  messagingSenderId: "287555596740",
  appId: "1:287555596740:web:c6b6fb500ac08025917491",
  measurementId: "G-Y82V9M771Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics can only be used in client components
// const analytics = getAnalytics(app);

export { auth, db };