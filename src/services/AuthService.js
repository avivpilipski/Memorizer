// src/services/AuthService.js
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword 
} from 'firebase/auth';

export class AuthService {
    constructor() {
        this.auth = getAuth();
        this.provider = new GoogleAuthProvider();
    }

    async signInWithGoogle() {
        try {
            const result = await signInWithPopup(this.auth, this.provider);
            return result.user;
        } catch (error) {
            console.error("Auth error:", error);
            throw error;
        }
    }

    async signInWithEmail(email, password) {
        try {
            const result = await signInWithEmailAndPassword(this.auth, email, password);
            return result.user;
        } catch (error) {
            console.error("Email sign in error:", error);
            throw error;
        }
    }

    async registerWithEmail(email, password) {
        try {
            const result = await createUserWithEmailAndPassword(this.auth, email, password);
            return result.user;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    }

    async signOut() {
        try {
            await this.auth.signOut();
        } catch (error) {
            console.error("Sign out error:", error);
            throw error;
        }
    }

    getCurrentUser() {
        return this.auth.currentUser;
    }
}