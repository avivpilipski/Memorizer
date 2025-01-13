import React, { useState } from 'react';
import { Music } from 'lucide-react';

export const UsernameSetup = ({ onUsernameSubmit, loading }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const generateRandomUsername = () => {
    const adjectives = ['Melodic', 'Rhythmic', 'Musical'];
    const nouns = ['Player', 'Artist', 'Musician'];
    const number = Math.floor(Math.random() * 1000);
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    setUsername(`${adj}${noun}${number}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    onUsernameSubmit(username);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-8">
            <Music className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-indigo-900 mb-6">
            Choose Your Username
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter username"
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
            <button
              type="button"
              onClick={generateRandomUsername}
              className="w-full px-4 py-2 text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50"
            >
              Generate Random Username
            </button>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
            >
              {loading ? 'Setting up...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};