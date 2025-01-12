import React from 'react';
import { Music, Calendar, Clock, Brain, Award } from 'lucide-react';

export const PieceForm = ({ formData, handleInputChange, handleSubmit }) => {
    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <div>
                <label className="flex items-center text-indigo-900 mb-2">
                    <Music className="w-5 h-5 mr-2" />
                    Piece Name
                </label>
                <input
                    type="text"
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
                    required
                />
            </div>

            <div>
                <label className="flex items-center text-indigo-900 mb-2">
                    <Brain className="w-5 h-5 mr-2" />
                    Complexity (1-5)
                </label>
                <input
                    type="range"
                    name="complexity"
                    min="1"
                    max="5"
                    value={formData.complexity}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                />
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
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
                Generate Practice Plan
            </button>
        </form>
    );
};