// src/components/MemorizerApp.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { PieceForm } from './PieceForm';
import { PracticePlan } from './PracticePlan';
import { PlanHistory } from './PlanHistory';
import { Notification } from './Notification';
import { DatabaseService } from '../services/DatabaseService';
import { PlanGeneratorService } from '../services/PlanGeneratorService';
import { auth } from '../firebase';

export const MemorizerApp = ({ user, username }) => {
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

  const dbService = new DatabaseService();
  const planGenerator = new PlanGeneratorService();

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const fetchSavedPlans = useCallback(async () => {
    try {
      const plans = await dbService.getUserPlans(user.uid);
      setSavedPlans(plans.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      showNotification(error.message, 'error');
    }
  }, [user.uid]);

  useEffect(() => {
    fetchSavedPlans();
  }, [fetchSavedPlans]);

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
      const generatedPlan = planGenerator.calculatePlan({
        duration: parseInt(formData.duration),
        complexity: parseInt(formData.complexity),
        priorPractice: parseInt(formData.priorPractice),
        performanceDate: formData.performanceDate
      });

      setPlan(generatedPlan);

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

  const handleSelectPlan = (plan) => {
    setEditingPlan(plan);
    setFormData(plan.pieceData);
    setPlan(plan.plan);
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

  const handleNewPiece = () => {
    setPlan(null);
    setEditingPlan(null);
    setFormData({
      pieceName: '',
      duration: '',
      complexity: '2',
      priorPractice: '',
      performanceDate: ''
    });
  };

  const handleSignOut = async () => {
    try {
      if (user.isGuest) {
        // For guest users, just reset the states
        setFormData({
          pieceName: '',
          duration: '',
          complexity: '2',
          priorPractice: '',
          performanceDate: ''
        });
        setPlan(null);
        setEditingPlan(null);
        window.location.reload(); // This will reset the app to the login screen
      } else {
        // For regular users, sign out from Firebase
        await auth.signOut();
      }
      showNotification('Signed out successfully!');
    } catch (error) {
      console.error('Sign out error:', error);
      showNotification('Error signing out. Please try again.', 'error');
    }
  };
  const [isSigningOut, setIsSigningOut] = useState(false);



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header - Now more mobile-friendly */}
        <div className="bg-white/70 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-3xl sm:text-4xl font-bold text-indigo-900 mb-1 sm:mb-2">Memorizer</h1>
              <p className="text-indigo-600 text-sm sm:text-base">Welcome, {username}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white text-indigo-600 rounded-lg sm:rounded-xl 
                       shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 
                       border border-indigo-100 text-sm sm:text-base"
            >
              Sign Out
            </button>
          </div>
        </div>
  
        {/* Main Content - Improved grid layout for mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Practice Plans Overview - Now collapses nicely on mobile */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white/70 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-indigo-900">Your Practice Plans</h2>
                <button
                  onClick={() => {
                    setPlan(null);
                    setEditingPlan(null);
                    setFormData({
                      pieceName: '',
                      duration: '',
                      complexity: '2',
                      priorPractice: '',
                      performanceDate: ''
                    });
                  }}
                  className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                           transition-all duration-200 text-sm transform hover:scale-105"
                >
                  Create New Plan
                </button>
              </div>
  
              <div className="space-y-3 sm:space-y-4 max-h-[calc(100vh-20rem)] overflow-y-auto 
                            scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
                {savedPlans.map((savedPlan, index) => (
                  <div
                    key={index}
                    className={`p-3 sm:p-4 rounded-lg border transition-all cursor-pointer
                             hover:shadow-md active:scale-98 ${
                      plan && plan === savedPlan.plan 
                        ? 'bg-indigo-50 border-indigo-300 shadow-md' 
                        : 'bg-white border-gray-200 hover:border-indigo-200'
                    }`}
                    onClick={() => {
                      setEditingPlan(savedPlan);
                      setFormData(savedPlan.pieceData);
                      setPlan(savedPlan.plan);
                    }}
                  >
                    <h3 className="font-medium text-indigo-900">{savedPlan.pieceData.pieceName}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Performance: {new Date(savedPlan.pieceData.performanceDate).toLocaleDateString()}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs sm:text-sm text-gray-500">{savedPlan.pieceData.duration} minutes</span>
                      <span className={`px-2 py-1 rounded-full text-xs sm:text-sm ${
                        new Date(savedPlan.pieceData.performanceDate) < new Date() 
                          ? 'bg-gray-100 text-gray-600' 
                          : 'bg-green-100 text-green-600'
                      } transition-colors duration-200`}>
                        {new Date(savedPlan.pieceData.performanceDate) < new Date() ? 'Past' : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                ))}
  
                {savedPlans.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm sm:text-base">No practice plans yet.</p>
                    <p className="text-indigo-600 text-sm mt-2">Create your first one!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
  
          {/* Main Content Area - Better mobile layout */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white/70 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6
                           transition-all duration-300 ease-in-out">
              {!plan ? (
                <div className="animate-fadeIn">
                  <PieceForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    loading={loading}
                  />
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <PracticePlan plan={plan} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};