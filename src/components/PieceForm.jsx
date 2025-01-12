// src/components/PieceForm.jsx
import React from 'react';
import { Music, Calendar, Clock, Brain, Award } from 'lucide-react';

export const PieceForm = ({ formData, handleInputChange, handleSubmit }) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
            <div>
                <label className="flex items-center text-indigo-900 mb-2">
                    <Music className="w-5 h-5 mr-2" />
                    Piece Name
                </label>
                <input
                    name="pieceName"
                    value={formData.pieceName}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                />
            </div>

            <div>
                <label className="flex items-center text-indigo-900 mb-2">
                    <Clock className="w-5 h-5 mr-2" />
                    Duration (minutes)
                </label>
                <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    min="1"
                    required
                />
            </div>

            <div>
                <label className="flex items-center text-indigo-900 mb-2">
                    <Brain className="w-5 h-5 mr-2" />
                    Complexity Level
                </label>
                <select
                    name="complexity"
                    value={formData.complexity}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                >
                    <option value="1">Beginner</option>
                    <option value="2">Intermediate</option>
                    <option value="3">Advanced</option>
                    <option value="4">Professional</option>
                </select>
            </div>

            <div>
                <label className="flex items-center text-indigo-900 mb-2">
                    <Award className="w-5 h-5 mr-2" />
                    Prior Practice (hours)
                </label>
                <input
                    type="number"
                    name="priorPractice"
                    value={formData.priorPractice}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    min="0"
                    required
                />
            </div>

            <div>
                <label className="flex items-center text-indigo-900 mb-2">
                    <Calendar className="w-5 h-5 mr-2" />
                    Performance Date
                </label>
                <input
                    type="date"
                    name="performanceDate"
                    value={formData.performanceDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
                Generate Practice Plan
            </button>
        </form>
    );
};