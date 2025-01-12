import React from 'react';
import { Music, Calendar, Clock, Brain, Award } from 'lucide-react';

export const PieceForm = ({ formData, handleInputChange, handleSubmit }) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Additional form fields... */}
            {/* Copy the rest of the form fields from the previous React component */}
        </form>
        
    );
};