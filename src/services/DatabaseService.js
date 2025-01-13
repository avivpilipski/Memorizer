// src/services/DatabaseService.js
import { 
    getFirestore, 
    collection, 
    doc, 
    getDoc,
    setDoc,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc
  } from 'firebase/firestore';
  import { db } from '../firebase'; // Import db from firebase.js
  
  export class DatabaseService {
    constructor() {
      this.db = db;
    }
  
    async getUserProfile(userId) {
      try {
        console.log('Getting user profile for:', userId);
        const userRef = doc(this.db, "users", userId);
        const userDoc = await getDoc(userRef);
        return userDoc.exists() ? userDoc.data() : null;
      } catch (error) {
        console.error("Error getting user profile:", error);
        throw new Error('Failed to fetch user profile');
      }
    }
  
    async checkUsernameAvailability(username) {
      try {
        const q = query(
          collection(this.db, "users"), 
          where("username", "==", username.toLowerCase())
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty;
      } catch (error) {
        console.error("Error checking username:", error);
        throw new Error('Failed to check username availability');
      }
    }
  
    async setUserProfile(userId, username) {
      try {
        const userRef = doc(this.db, "users", userId);
        await setDoc(userRef, {
          username: username.toLowerCase(),
          displayUsername: username,
          createdAt: new Date()
        });
      } catch (error) {
        console.error("Error setting user profile:", error);
        throw new Error('Failed to set user profile');
      }
    }
  
    async savePracticePlan(userId, pieceData, plan) {
      try {
        const docRef = await addDoc(collection(this.db, "practice_plans"), {
          userId,
          pieceData,
          plan,
          createdAt: new Date()
        });
        return docRef.id;
      } catch (error) {
        console.error("Error saving plan:", error);
        throw new Error('Failed to save practice plan');
      }
    }
  
    async updatePracticePlan(planId, pieceData, plan) {
      try {
        const planRef = doc(this.db, "practice_plans", planId);
        await updateDoc(planRef, {
          pieceData,
          plan,
          updatedAt: new Date()
        });
      } catch (error) {
        console.error("Error updating plan:", error);
        throw new Error('Failed to update practice plan');
      }
    }
  
    async deletePracticePlan(planId) {
      try {
        const planRef = doc(this.db, "practice_plans", planId);
        await deleteDoc(planRef);
      } catch (error) {
        console.error("Error deleting plan:", error);
        throw new Error('Failed to delete practice plan');
      }
    }
  
    async getUserPlans(userId) {
      try {
        const q = query(
          collection(this.db, "practice_plans"),
          where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error fetching plans:", error);
        throw new Error('Failed to fetch practice plans');
      }
    }
  }