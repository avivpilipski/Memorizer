import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

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