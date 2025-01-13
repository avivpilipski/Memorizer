// src/App.jsx
import React, { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { MemorizerApp } from './components/MemorizerApp';
import { UsernameSetup } from './components/UsernameSetup';
import { DatabaseService } from './services/DatabaseService';
import { auth } from './firebase';

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settingUsername, setSettingUsername] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const dbService = new DatabaseService();

  useEffect(() => {
    console.log('Setting up auth listener');
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('Auth state changed:', user?.uid);
      
      // Handle sign out
      if (!user) {
        setIsTransitioning(true);
        // Add a small delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 300));
        setUser(null);
        setUserProfile(null);
        setIsTransitioning(false);
        setLoading(false);
        return;
      }

      // Handle sign in
      setUser(user);
      try {
        console.log('Fetching user profile for:', user.uid);
        const profile = await dbService.getUserProfile(user.uid);
        console.log('Retrieved profile:', profile);
        setUserProfile(profile);
        setSettingUsername(!profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError(`Failed to load user profile: ${error.message}`);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUsernameSubmit = async (username) => {
    setSettingUsername(true);
    try {
      const isAvailable = await dbService.checkUsernameAvailability(username);
      
      if (!isAvailable) {
        throw new Error('Username is already taken');
      }

      await dbService.setUserProfile(user.uid, username);
      const profile = await dbService.getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Username setup error:', error);
      throw error;
    } finally {
      setSettingUsername(false);
    }
  };

  const handleSignIn = async () => {
    try {
      console.log('Starting Google sign-in...');
      const provider = new GoogleAuthProvider();
      console.log('Provider created');
      const result = await signInWithPopup(auth, provider);
      console.log('Sign-in successful:', result.user.email);
    } catch (error) {
      console.error('Detailed sign-in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setError(`Sign-in failed: ${error.message}`);
    }
  };

  return (
    <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-indigo-600">Loading...</p>
          </div>
        </div>
      ) : error ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-red-600 text-xl font-semibold mb-4">Error</h2>
            <p className="text-gray-800 mb-4">{error}</p>
            <div className="flex gap-4">
              <button
                onClick={() => setError(null)}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => auth.signOut()}
                className="flex-1 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      ) : !user ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Welcome to Memorizer</h1>
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6">
              <button
                onClick={handleSignIn}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      ) : !userProfile ? (
        <UsernameSetup
          onUsernameSubmit={handleUsernameSubmit}
          loading={settingUsername}
        />
      ) : (
        <MemorizerApp user={user} username={userProfile.displayUsername} />
      )}
    </div>
  );
}

export default App;