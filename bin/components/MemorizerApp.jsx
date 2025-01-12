// src/components/MemorizerApp.jsx
import React, { useState } from 'react';
import { PieceForm } from './PieceForm';
import { PracticePlan } from './PracticePlan';
import { AuthService } from '../services/AuthService';
import { DatabaseService } from '../services/DatabaseService';
import { PlanGeneratorService } from '../services/PlanGeneratorService';

export const MemorizerApp = () => {
    const [formData, setFormData] = useState({
        pieceName: '',
        duration: '',
        complexity: '2',
        priorPractice: '',
        performanceDate: ''
    });
    const [plan, setPlan] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const authService = new AuthService();
    const dbService = new DatabaseService();
    const planGenerator = new PlanGeneratorService();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const generatedPlan = planGenerator.calculatePlan({
            duration: parseInt(formData.duration),
            complexity: parseInt(formData.complexity),
            priorPractice: parseInt(formData.priorPractice),
            performanceDate: formData.performanceDate
        });

        setPlan(generatedPlan);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);

        // Save plan if user is authenticated
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            await dbService.savePracticePlan(currentUser.uid, formData, generatedPlan);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-indigo-900 mb-4">Memorizer</h1>
                    <p className="text-lg text-indigo-700">Your Personal Music Practice Planner</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    <PieceForm 
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                    />
                    {plan && <PracticePlan plan={plan} />}
                </div>
            </div>
            
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl animate-bounce">🎉</div>
                    </div>
                </div>
            )}
        </div>
    );
};