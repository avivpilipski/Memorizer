// src/services/DatabaseService.js
import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs,
    doc,
    updateDoc,
    deleteDoc 
  } from 'firebase/firestore';
  
  export class DatabaseService {
    constructor() {
      this.db = getFirestore();
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
        throw new Error('Failed to save practice plan. Please try again.');
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
        throw new Error('Failed to update practice plan. Please try again.');
      }
    }
  
    async deletePracticePlan(planId) {
      try {
        const planRef = doc(this.db, "practice_plans", planId);
        await deleteDoc(planRef);
      } catch (error) {
        console.error("Error deleting plan:", error);
        throw new Error('Failed to delete practice plan. Please try again.');
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
        throw new Error('Failed to fetch practice plans. Please try again.');
      }
    }
  }