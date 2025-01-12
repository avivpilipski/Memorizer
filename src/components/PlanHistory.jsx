// src/components/PlanHistory.jsx
import React from 'react';
import { Clock, Calendar, Music } from 'lucide-react';

export const PlanHistory = ({ plans, onSelectPlan, onDeletePlan }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-indigo-900 mb-4">Practice Plan History</h2>
      {plans.length === 0 ? (
        <p className="text-gray-500">No saved practice plans yet.</p>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg flex items-center">
                    <Music className="w-4 h-4 mr-2" />
                    {plan.pieceData.pieceName}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1 space-y-1">
                    <p className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Duration: {plan.pieceData.duration} minutes
                    </p>
                    <p className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Performance: {new Date(plan.pieceData.performanceDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => onSelectPlan(plan)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    View/Edit
                  </button>
                  <button
                    onClick={() => onDeletePlan(plan.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};