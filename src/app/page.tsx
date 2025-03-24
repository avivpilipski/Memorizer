'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { PracticeSession, CalendarEvent } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMusicNote, HiOutlineCalendar, HiOutlineClock, HiOutlineStar, 
         HiArrowLeft, HiOutlineSparkles, HiOutlineLightBulb, HiOutlineClipboardCheck } from 'react-icons/hi';

export default function Home() {
  // State management with useState hooks
  const [formData, setFormData] = useState({
    pieceName: '',
    complexity: '3',
    duration: '',
    learningTime: '',
    performanceDate: ''
  });
  
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [practiceSchedule, setPracticeSchedule] = useState<PracticeSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState<'form' | 'calendar'>('form');
  const [selectedDay, setSelectedDay] = useState<PracticeSession | null>(null);
  const [notes, setNotes] = useState<{[key: string]: string}>({});
  const [aiTip, setAiTip] = useState<string>('');
  const [aiTipExpanded, setAiTipExpanded] = useState(false);

  // Form submission handler
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
        start: session.date,
        end: session.date,
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

  // Form input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Get color based on practice focus
  const getColorForFocus = (focus: string) => {
    if (focus.includes('Learning') || focus.includes('technical')) {
      return 'rgba(79, 70, 229, 0.9)'; // indigo with transparency
    } else if (focus.includes('Interpretation')) {
      return 'rgba(8, 145, 178, 0.9)'; // cyan with transparency
    } else if (focus.includes('Performance')) {
      return 'rgba(124, 58, 237, 0.9)'; // purple with transparency
    } else if (focus.includes('Final')) {
      return 'rgba(192, 38, 211, 0.9)'; // fuchsia with transparency
    }
    return 'rgba(59, 130, 246, 0.9)'; // blue default with transparency
  };
  
  // Navigation handlers
  const handleBackToForm = () => {
    setActiveView('form');
  };

  // Handle day click to show details
  const handleDayClick = (info: any) => {
    const clickedDate = info.dateStr;
    const session = practiceSchedule.find(s => s.date === clickedDate);
    
    if (session) {
      setSelectedDay(session);
      // Generate AI tip based on the focus
      generateAiTip(session.focus);
    }
  };
  
  // Generate AI tip for practice
  const generateAiTip = (focus: string) => {
    let tip = '';
    
    if (focus.includes('Learning') || focus.includes('technical')) {
      tip = "Focus on small sections today. Try the 'chunking' technique - master 4-8 measures before moving on. Use a metronome at 70% of target tempo. Analyze the structure of the piece to identify patterns that can help with memorization.";
    } else if (focus.includes('Interpretation')) {
      tip = "Listen to 2-3 different recordings of this piece. Note the differences in dynamics, phrasing, and tempo. Experiment with your own interpretive choices. Try singing the melodic lines to internalize the phrasing. Consider the historical context of the piece to inform your interpretation.";
    } else if (focus.includes('Performance')) {
      tip = "Practice performing the entire piece without stopping. Record yourself and analyze your performance. Focus on maintaining consistency even through difficult passages. Simulate performance conditions by playing for friends or family. Practice recovery strategies for potential memory slips.";
    } else if (focus.includes('Final')) {
      tip = "Simulate performance conditions. Dress as you would for the performance, and play through the entire piece. Focus on stage presence and performance anxiety management techniques. Practice deep breathing exercises before playing. Visualize a successful performance before you begin.";
    } else {
      tip = "Break your practice into 25-minute focused sessions with 5-minute breaks. Start with scales related to your piece's key signature. Use mental practice techniques to reinforce memory away from your instrument.";
    }
    
    setAiTip(tip);
  };
  
  // Save notes for a specific day
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedDay) {
      setNotes({
        ...notes,
        [selectedDay.date]: e.target.value
      });
    }
  };
  
  // Close the day detail modal
  const handleCloseDetail = () => {
    setSelectedDay(null);
    setAiTipExpanded(false);
  };

  // Toggle AI tip expanded state
  const toggleAiTipExpanded = () => {
    setAiTipExpanded(!aiTipExpanded);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50/30 to-white">
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-center mb-12 text-gray-800 tracking-tight flex items-center justify-center"
        >
          <HiOutlineMusicNote className="mr-3 text-indigo-600" /> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Memorizer</span>
        </motion.h1>
        
        <AnimatePresence mode="wait">
          {/* Form view */}
          {activeView === 'form' && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-indigo-100"
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create Your Practice Plan</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="pieceName" className="block text-sm font-medium text-gray-700 flex items-center">
                    <HiOutlineMusicNote className="mr-2 text-indigo-600" /> Piece Name
                  </label>
                  <input
                    type="text"
                    id="pieceName"
                    name="pieceName"
                    value={formData.pieceName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all"
                    required
                    placeholder="Enter piece name"
                  />
                </div>

                <div>
                  <label htmlFor="complexity" className="block text-sm font-medium text-gray-700 flex items-center">
                    <HiOutlineStar className="mr-2 text-indigo-600" /> Complexity
                  </label>
                  <select
                    id="complexity"
                    name="complexity"
                    value={formData.complexity}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all"
                    required
                  >
                    {[1, 2, 3, 4, 5].map(level => (
                      <option key={level} value={level}>
                        {level} - {level === 1 ? 'Easy' : level === 2 ? 'Moderate' : level === 3 ? 'Intermediate' : level === 4 ? 'Advanced' : 'Virtuosic'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 flex items-center">
                    <HiOutlineClock className="mr-2 text-indigo-600" /> Duration (minutes)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                    className="mt-1 block w-full rounded-lg border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all"
                    required
                    placeholder="How long is the piece?"
                  />
                </div>

                <div>
                  <label htmlFor="learningTime" className="block text-sm font-medium text-gray-700 flex items-center">
                    <HiOutlineClock className="mr-2 text-indigo-600" /> Learning Time (days)
                  </label>
                  <input
                    type="number"
                    id="learningTime"
                    name="learningTime"
                    value={formData.learningTime}
                    onChange={handleChange}
                    min="0"
                    className="mt-1 block w-full rounded-lg border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all"
                    required
                    placeholder="Days already spent learning"
                  />
                </div>

                <div>
                  <label htmlFor="performanceDate" className="block text-sm font-medium text-gray-700 flex items-center">
                    <HiOutlineCalendar className="mr-2 text-indigo-600" /> Performance Date
                  </label>
                  <input
                    type="date"
                    id="performanceDate"
                    name="performanceDate"
                    value={formData.performanceDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  <HiOutlineSparkles className="mr-2" /> Generate Personalized Schedule
                </motion.button>
              </form>
            </motion.div>
          )}
          
          {/* Loading state */}
          {isLoading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto mt-8 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-100 flex flex-col items-center"
            >
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-indigo-700 font-medium text-lg">Creating your personalized practice plan...</p>
              <p className="text-gray-500 text-sm mt-2">This may take a moment as we optimize your schedule</p>
            </motion.div>
          )}
          
          {/* Error state */}
          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto mt-8 p-6 bg-red-50 rounded-xl shadow-lg border border-red-100"
            >
              <p className="text-center text-red-700 font-medium">{error}</p>
            </motion.div>
          )}
          
          {/* Calendar view */}
          {activeView === 'calendar' && practiceSchedule.length > 0 && (
            <motion.div 
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mx-auto mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-100 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Practice Schedule</h2>
                    <p className="text-gray-600">Piece: {formData.pieceName} • Complexity: {formData.complexity} • Performance: {new Date(formData.performanceDate).toLocaleDateString()}</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBackToForm}
                    className="px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors flex items-center self-start shadow-sm border border-indigo-100"
                  >
                    <HiArrowLeft className="mr-2" /> Back to Form
                  </motion.button>
                </div>
                
                <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { type: 'Learning/Technical', color: '#4f46e5', icon: HiOutlineClipboardCheck },
                    { type: 'Interpretation', color: '#0891b2', icon: HiOutlineMusicNote },
                    { type: 'Performance Prep', color: '#7c3aed', icon: HiOutlineSparkles },
                    { type: 'Final Prep', color: '#c026d3', icon: HiOutlineLightBulb }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center bg-white/70 p-3 rounded-lg shadow-sm">
                      <div 
                        className="w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item.type}</span>
                    </div>
                  ))}
                </div>
                
                <div className="calendar-container bg-white rounded-xl overflow-hidden shadow-sm mb-8 p-1">
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
                    dateClick={handleDayClick}
                    eventClick={(info) => handleDayClick({ dateStr: info.event.startStr })}
                    eventContent={(arg) => {
                      return {
                        html: 
                          `<div style="padding: 0.5rem; font-size: 0.75rem; color: white; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); height: 100%;">
                            <div style="font-weight: 600; margin-bottom: 2px;">${arg.event.extendedProps?.focus || ''}</div>
                            <div style="display: flex; align-items: center; opacity: 0.9;">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              ${arg.event.extendedProps?.duration || ''} min
                            </div>
                          </div>`
                      };
                    }}
                    dayCellClassNames="hover:bg-indigo-50 cursor-pointer transition-colors"
                    eventClassNames="rounded-lg overflow-hidden"
                  />
                </div>
                
                {/* Practice sessions list */}
                <div className="overflow-x-auto">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                    <HiOutlineClock className="mr-2 text-indigo-600" /> Practice Sessions
                  </h3>
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Focus</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {practiceSchedule.map((session, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Day {session.day}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(session.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: getColorForFocus(session.focus) }}
                                ></div>
                                {session.focus}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.duration} min</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setSelectedDay(session);
                                  generateAiTip(session.focus);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                              >
                                View Details
                              </motion.button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Day detail modal */}
        <AnimatePresence>
          {selectedDay && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">
                        Day {selectedDay.day}
                      </h3>
                      <p className="text-gray-500">{new Date(selectedDay.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCloseDetail}
                      className="text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                  
                  <div className="mb-8 bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center mb-4">
                      <div 
                        className="w-10 h-10 rounded-full mr-4 flex items-center justify-center text-white"
                        style={{ backgroundColor: getColorForFocus(selectedDay.focus) }}
                      >
                        {selectedDay.focus.includes('Learning') ? (
                          <HiOutlineClipboardCheck className="w-5 h-5" />
                        ) : selectedDay.focus.includes('Interpretation') ? (
                          <HiOutlineMusicNote className="w-5 h-5" />
                        ) : selectedDay.focus.includes('Performance') ? (
                          <HiOutlineSparkles className="w-5 h-5" />
                        ) : (
                          <HiOutlineLightBulb className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-gray-800">{selectedDay.focus}</h4>
                        <p className="text-gray-600">Duration: {selectedDay.duration} minutes</p>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div 
                    className="mb-8 bg-indigo-50 p-6 rounded-xl overflow-hidden"
                    animate={{ height: aiTipExpanded ? 'auto' : '160px' }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-indigo-800 flex items-center">
                        <HiOutlineLightBulb className="w-5 h-5 mr-2" />
                        AI Practice Tip
                      </h4>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleAiTipExpanded}
                        className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
                      >
                        {aiTipExpanded ? 'Show Less' : 'Show More'}
                      </motion.button>
                    </div>
                    <div className={`text-indigo-700 ${aiTipExpanded ? '' : 'line-clamp-3'}`}>
                      {aiTip}
                    </div>
                  </motion.div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <HiOutlineClipboardCheck className="w-5 h-5 mr-2 text-indigo-600" />
                      Your Practice Notes
                    </label>
                    <textarea
                      id="notes"
                      rows={5}
                      className="w-full rounded-xl border-0 p-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all"
                      placeholder="Write your practice notes here..."
                      value={notes[selectedDay.date] || ''}
                      onChange={handleNotesChange}
                    ></textarea>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleCloseDetail}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                    >
                      Save & Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="py-8 text-center text-sm text-gray-500">
        <p>Memorizer © {new Date().getFullYear()} • Elevate your practice routine</p>
      </footer>
    </div>
  );
}
