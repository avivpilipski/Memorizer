'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    pieceName: '',
    complexity: '3',
    duration: '',
    learningTime: '',
    performanceDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to generate practice schedule
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Music Practice Scheduler
        </h1>
        
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
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
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Generate Practice Schedule
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
