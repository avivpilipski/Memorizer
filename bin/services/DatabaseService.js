import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

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
            throw error;
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
            throw error;
        }
    }
}