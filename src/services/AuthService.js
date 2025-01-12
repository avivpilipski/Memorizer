import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export class AuthService {
    constructor() {
      this.auth = auth;
      this.googleProvider = new GoogleAuthProvider();
    }

    async signInWithGoogle() {
        try {
          return await signInWithPopup(this.auth, this.googleProvider);
        } catch (error) {
          console.error('Error signing in with Google:', error);
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