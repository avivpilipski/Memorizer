// src/services/PlanGeneratorService.js
export class PlanGeneratorService {
    constructor() {
        this.MINUTES_PER_DAY = 120; // Maximum practice minutes per day
    }

    calculatePlan(pieceData) {
        const { duration, complexity, priorPractice, performanceDate } = pieceData;
        
        // Calculate total days until performance
        const today = new Date();
        const performanceDay = new Date(performanceDate);
        const totalDays = Math.ceil((performanceDay - today) / (1000 * 60 * 60 * 24));

        // Calculate required practice time
        const baseHours = duration * complexity * 5;
        const remainingHours = Math.max(0, baseHours - priorPractice);
        const dailyMinutes = Math.min(
            this.MINUTES_PER_DAY,
            Math.ceil((remainingHours * 60) / totalDays)
        );

        return this.generateDailyPlans(today, totalDays, dailyMinutes);
    }

    generateDailyPlans(startDate, totalDays, dailyMinutes) {
        const plans = [];
        
        for (let day = 0; day < totalDays; day++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + day);
            
            plans.push({
                date: currentDate.toLocaleDateString(),
                minutes: dailyMinutes,
                focus: this.generateFocus(day, totalDays)
            });
        }

        return plans;
    }

    generateFocus(currentDay, totalDays) {
        const progress = currentDay / totalDays;
        
        if (progress < 0.3) {
            return "Section breakdown and initial memorization";
        } else if (progress < 0.6) {
            return "Detailed work and strengthening memory";
        } else if (progress < 0.8) {
            return "Run-throughs and mental practice";
        } else {
            return "Performance preparation and maintenance";
        }
    }
}