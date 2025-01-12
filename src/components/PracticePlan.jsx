// src/components/PracticePlan.jsx
import React from 'react';
import { Calendar, Clock, Target } from 'lucide-react';

export const PracticePlan = ({ plan }) => {
  return (
    <div className="space-y-4">
      {plan.map((day, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 transform hover:-translate-y-1 transition-all duration-300 border border-indigo-100/50 shadow-md hover:shadow-xl"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold text-indigo-900">{day.date}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span className="text-indigo-800">
                  Practice time: {day.minutes} minutes
                </span>
              </div>

              <div className="flex items-start space-x-2">
                <Target className="w-5 h-5 text-indigo-600 mt-1" />
                <span className="text-indigo-700">{day.focus}</span>
              </div>
            </div>

            <div className="bg-white/80 rounded-lg px-3 py-1 shadow-sm">
              <span className="text-sm font-medium text-indigo-600">
                Day {index + 1}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};