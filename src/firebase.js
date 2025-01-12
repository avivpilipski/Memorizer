// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

console.log('Starting Firebase initialization...');

const firebaseConfig = {
    apiKey: "AIzaSyAUtgK2UgiFbF5q77tuJY7IqfLPyp5y_sw",
    authDomain: "webdevaviv.firebaseapp.com",
    projectId: "webdevaviv",
    storageBucket: "webdevaviv.firebasestorage.app",
    messagingSenderId: "903273183409",
    appId: "1:903273183409:web:54813b0fbcfa9736f70a90",
    measurementId: "G-TZYW5555JF"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('Firebase initialized successfully');

export { auth, db };
export default app;