'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventContentArg } from '@fullcalendar/core';
// Remove unused import
// import { EventImpl } from '@fullcalendar/core/internal';
import { PracticeSession, CalendarEvent } from '../types';

export default function Home() {
  const [formData, setFormData] = useState({
    pieceName: '',
    complexity: '3',
    duration: '',
    learningTime: '',
    performanceDate: ''
  });
  
  // For calendar events
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  
  const [practiceSchedule, setPracticeSchedule] = useState<PracticeSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState<'form' | 'calendar'>('form');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPracticeSchedule([]);
    
    try {
      const response = await fetch('/api/generate-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate practice schedule');
      }
      
      setPracticeSchedule(data.schedule);
      
      // Convert practice schedule to calendar events
      const events = data.schedule.map((session: PracticeSession): CalendarEvent => ({
        title: `${session.focus} (${session.duration} min)`,
        start: session.date, // Use the string date directly
        end: session.date,   // Use the string date directly
        allDay: true,
        extendedProps: {
          day: session.day,
          duration: session.duration,
          focus: session.focus
        },
        backgroundColor: getColorForFocus(session.focus),
        borderColor: getColorForFocus(session.focus)
      }));
      
      setCalendarEvents(events);
      setActiveView('calendar');
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the practice schedule');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Function to get color based on focus area
  const getColorForFocus = (focus: string) => {
    if (focus.includes('Learning') || focus.includes('technical')) {
      return '#4f46e5'; // indigo for learning/technical
    } else if (focus.includes('Interpretation')) {
      return '#0891b2'; // cyan for interpretation
    } else if (focus.includes('Performance')) {
      return '#7c3aed'; // purple for performance
    } else if (focus.includes('Final')) {
      return '#c026d3'; // fuchsia for final prep
    }
    return '#3b82f6'; // blue default
  };
  
  // Switch back to form view
  const handleBackToForm = () => {
    setActiveView('form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-5xl font-bold text-center mb-8 text-indigo-800 dark:text-indigo-300 tracking-tight">
          Music Practice Scheduler
        </h1>
        
        {activeView === 'form' && (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-indigo-100 dark:border-indigo-900">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="pieceName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Piece Name
              </label>
              <input
                type="text"
                id="pieceName"
                name="pieceName"
                value={formData.pieceName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="complexity" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Complexity Level (1-5)
              </label>
              <select
                id="complexity"
                name="complexity"
                value={formData.complexity}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                {[1, 2, 3, 4, 5].map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Piece Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="learningTime" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Time Learning (days)
              </label>
              <input
                type="number"
                id="learningTime"
                name="learningTime"
                value={formData.learningTime}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="performanceDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Performance Date
              </label>
              <input
                type="date"
                id="performanceDate"
                name="performanceDate"
                value={formData.performanceDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Generate Practice Schedule
            </button>
          </form>
        </div>
        )}
        
        {isLoading && (
          <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-indigo-100 dark:border-indigo-900">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              <p className="ml-4 text-indigo-700 dark:text-indigo-300 font-medium">Generating your practice schedule...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 dark:bg-red-900 rounded-xl shadow-xl border border-red-100 dark:border-red-800">
            <p className="text-center text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
        )}
        
        {activeView === 'calendar' && practiceSchedule.length > 0 && (
          <div className="mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-indigo-100 dark:border-indigo-900">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">Your Practice Schedule</h2>
              <div className="flex space-x-4">
                <button 
                  onClick={handleBackToForm}
                  className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                >
                  Back to Form
                </button>
              </div>
            </div>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {['Learning/Technical', 'Interpretation', 'Performance Prep', 'Final Prep'].map((type, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ backgroundColor: [
                      '#4f46e5', // indigo for learning/technical
                      '#0891b2', // cyan for interpretation
                      '#7c3aed', // purple for performance
                      '#c026d3'  // fuchsia for final prep
                    ][index] }}
                  ></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                </div>
              ))}
            </div>
            
            <div className="calendar-container bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek'
                }}
                events={calendarEvents}
                height="auto"
                eventContent={(arg) => {
                  return {
                    html: 
                      `<div style="padding: 0.25rem; font-size: 0.75rem;">
                        <div style="font-weight: bold;">${arg.event.extendedProps?.focus || ''}</div>
                        <div>${arg.event.extendedProps?.duration || ''} min</div>
                      </div>`
                  };
                }}
              />
            </div>
            
            <div className="mt-8 overflow-x-auto">
              <h3 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-indigo-300">Practice Sessions List</h3>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-indigo-50 dark:bg-indigo-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">Day</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">Focus</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">Duration (min)</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {practiceSchedule.map((session, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-indigo-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">Day {session.day}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{new Date(session.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{session.focus}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{session.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      
      <footer className="py-6 text-center text-sm text-indigo-500 dark:text-indigo-400">
        <p>Music Practice Scheduler © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
