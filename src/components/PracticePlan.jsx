// src/components/PracticePlan.jsx
import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  Edit2, 
  Save, 
  X 
} from 'lucide-react';

export const PracticePlan = ({ plan, user }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [notes, setNotes] = useState({});
  const [completed, setCompleted] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Group days by month
  const months = {};
  plan.forEach(day => {
    const date = new Date(day.date);
    const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!months[monthKey]) {
      months[monthKey] = [];
    }
    months[monthKey].push(day);
  });

  const handleNoteChange = (date, note) => {
    setNotes(prev => ({
      ...prev,
      [date]: note
    }));
  };

  const toggleCompletion = (date) => {
    setCompleted(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const getDayColor = (day) => {
    if (completed[day.date]) return 'bg-green-50 border-green-200';
    const progress = plan.indexOf(day) / plan.length;
    if (progress < 0.3) return 'bg-blue-50 border-blue-200';
    if (progress < 0.6) return 'bg-indigo-50 border-indigo-200';
    if (progress < 0.8) return 'bg-purple-50 border-purple-200';
    return 'bg-violet-50 border-violet-200';
  };

  return (
    <div className="p-6 space-y-8">
      {Object.entries(months).map(([monthYear, days]) => (
        <div key={monthYear} className="space-y-4">
          <h3 className="text-xl font-semibold text-indigo-900">{monthYear}</h3>
          <div className="grid grid-cols-7 gap-4">
            {/* Week day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Empty spaces for alignment */}
            {Array.from({ length: new Date(days[0].date).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Practice days */}
            {days.map(day => (
              <div
                key={day.date}
                className={`relative p-2 border rounded-lg cursor-pointer transition-all hover:shadow-md ${getDayColor(day)}`}
                onClick={() => setSelectedDay(day)}
              >
                <div className="text-sm font-medium">
                  {new Date(day.date).getDate()}
                </div>
                <div className="text-xs text-gray-500">
                  {day.minutes} min
                </div>
                {completed[day.date] && (
                  <CheckCircle className="absolute top-1 right-1 w-4 h-4 text-green-500" />
                )}
                {notes[day.date] && (
                  <div className="absolute bottom-1 right-1">
                    <Edit2 className="w-3 h-3 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Day Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-indigo-900">
                {new Date(selectedDay.date).toLocaleDateString('default', { 
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric' 
                })}
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-indigo-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>Practice time: {selectedDay.minutes} minutes</span>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Focus:</h4>
                <p className="text-gray-600">{selectedDay.focus}</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">Practice Notes:</h4>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={notes[selectedDay.date] || ''}
                      onChange={(e) => handleNoteChange(selectedDay.date, e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      rows="4"
                      placeholder="Add your practice notes here..."
                    />
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      <Save className="w-4 h-4" />
                      Save Notes
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-600 min-h-[4rem] p-2 bg-gray-50 rounded-lg">
                    {notes[selectedDay.date] || 'No notes yet'}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="completed"
                  checked={completed[selectedDay.date] || false}
                  onChange={() => toggleCompletion(selectedDay.date)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="completed" className="text-gray-700">
                  Mark practice as completed
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};