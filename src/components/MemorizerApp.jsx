// src/components/MemorizerApp.jsx
import React, { useState, useEffect } from 'react';
import { PieceForm } from './PieceForm';
import { PracticePlan } from './PracticePlan';
import { PlanHistory } from './PlanHistory';
import { Notification } from './Notification';
import { DatabaseService } from '../services/DatabaseService';
import { PlanGeneratorService } from '../services/PlanGeneratorService';
import { auth } from '../firebase';

export const MemorizerApp = ({ user }) => {
  const [formData, setFormData] = useState({
    pieceName: '',
    duration: '',
    complexity: '2',
    priorPractice: '',
    performanceDate: ''
  });
  const [plan, setPlan] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const dbService = new DatabaseService();
  const planGenerator = new PlanGeneratorService();

  useEffect(() => {
    fetchSavedPlans();
  }, [user.uid]);

  const fetchSavedPlans = async () => {
    try {
      const plans = await dbService.getUserPlans(user.uid);
      setSavedPlans(plans.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate performance date
      const performanceDate = new Date(formData.performanceDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (performanceDate < today) {
        showNotification('Performance date cannot be in the past', 'error');
        setLoading(false);
        return;
      }

      const generatedPlan = planGenerator.calculatePlan({
        duration: parseInt(formData.duration),
        complexity: parseInt(formData.complexity),
        priorPractice: parseInt(formData.priorPractice),
        performanceDate: formData.performanceDate
      });

      // Start transition
      setIsTransitioning(true);
      setTimeout(() => {
        setPlan(generatedPlan);
        setIsTransitioning(false);
      }, 300);

      if (editingPlan) {
        await dbService.updatePracticePlan(editingPlan.id, formData, generatedPlan);
        showNotification('Plan updated successfully!');
      } else {
        await dbService.savePracticePlan(user.uid, formData, generatedPlan);
        showNotification('Plan saved successfully!');
      }

      fetchSavedPlans();
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPiece = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setPlan(null);
      setEditingPlan(null);
      setFormData({
        pieceName: '',
        duration: '',
        complexity: '2',
        priorPractice: '',
        performanceDate: ''
      });
      setIsTransitioning(false);
    }, 300);
  };

  const handleSelectPlan = (plan) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setEditingPlan(plan);
      setFormData(plan.pieceData);
      setPlan(plan.plan);
      setIsTransitioning(false);
    }, 300);
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await dbService.deletePracticePlan(planId);
        showNotification('Plan deleted successfully!');
        fetchSavedPlans();
      } catch (error) {
        showNotification(error.message, 'error');
      }
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      showNotification('Signed out successfully!');
    } catch (error) {
      showNotification('Error signing out. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl mb-8 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-indigo-900 mb-2">Memorizer</h1>
              <p className="text-indigo-600">Welcome, {user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-6 py-3 bg-white text-indigo-600 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border border-indigo-100"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-indigo-900">
                {editingPlan ? 'Edit Practice Plan' : 'Create New Practice Plan'}
              </h2>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl flex-1">
              <PieceForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                loading={loading}
              />
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div 
              className={`transition-opacity duration-300 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {plan ? (
                <div className="flex flex-col h-full">
                  <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-indigo-900">Your Practice Plan</h2>
                    <button
                      onClick={handleNewPiece}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      New Piece
                    </button>
                  </div>
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl flex-1">
                    <PracticePlan plan={plan} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-indigo-900">Practice Plan History</h2>
                  </div>
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl flex-1">
                    <PlanHistory
                      plans={savedPlans}
                      onSelectPlan={handleSelectPlan}
                      onDeletePlan={handleDeletePlan}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </div>
  );
};