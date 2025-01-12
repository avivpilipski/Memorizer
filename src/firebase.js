import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // Add this

const firebaseConfig = {
    apiKey: "AIzaSyBq0Hs5ToVxiTbhOmXHfaZvgcqQVarDKMQ",
    authDomain: "memorizer-dc718.firebaseapp.com",
    projectId: "memorizer-dc718",
    storageBucket: "memorizer-dc718.firebasestorage.app",
    messagingSenderId: "232463494683",
    appId: "1:232463494683:web:95767d2d28f3c7fb1392be"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  // Add this