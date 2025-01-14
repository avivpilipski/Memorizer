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

  const dbService = new DatabaseService();

  useEffect(() => {
    console.log('Setting up auth listener');
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('Auth state changed:', user?.uid);
      
      if (user && !user.isGuest) {
        try {
          console.log('Fetching user profile for:', user.uid);
          const profile = await dbService.getUserProfile(user.uid);
          console.log('Retrieved profile:', profile);
          setUser(user);
          setUserProfile(profile);
          setSettingUsername(!profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setError(`Failed to load user profile: ${error.message}`);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      console.log('Starting Google sign-in...');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Sign-in successful:', result.user.email);
    } catch (error) {
      console.error('Sign-in error:', error);
      setError(error.message);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      const guestUser = {
        uid: `guest_${Date.now()}`,
        email: 'guest@memorizer.app',
        isGuest: true
      };
      
      setUser(guestUser);
      setUserProfile({
        displayUsername: 'Guest User',
        username: 'guest',
        isGuest: true
      });
    } catch (error) {
      console.error('Guest sign-in error:', error);
      setError('Failed to sign in as guest. Please try again.');
    }
  };

  const handleSignOut = () => {
    // Clear all states regardless of user type
    setUser(null);
    setUserProfile(null);
    
    // Remove guest flag if it exists
    localStorage.removeItem('isGuest');
    
    // Clear any errors
    setError(null);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-indigo-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 animate-slideUp">
          <h2 className="text-red-600 text-xl font-semibold mb-4">Error</h2>
          <p className="text-gray-800 mb-4">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={() => setError(null)}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center animate-fadeIn">
            <h1 className="text-4xl font-bold text-indigo-900 mb-4">Welcome to Memorizer</h1>
            <p className="text-indigo-600 mb-8">Your personal music practice planner</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 space-y-4 animate-slideUp">
            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 
                       text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-indigo-300
                       transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Sign in with Google
            </button>
  
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/70 text-gray-500">or</span>
              </div>
            </div>
  
            <button
              onClick={handleGuestSignIn}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white 
                       py-3 px-4 rounded-xl hover:bg-indigo-700 transition-all duration-300 
                       transform hover:-translate-y-1 hover:shadow-md"
            >
              Continue as Guest
            </button>
          </div>
  
          <div className="text-center mt-8 animate-fadeIn opacity-75">
            <p className="text-sm text-indigo-400">Created by Aviv Pilipski</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile && !user.isGuest) {
    return (
      <UsernameSetup
        onUsernameSubmit={handleUsernameSubmit}
        loading={settingUsername}
      />
    );
  }

  return <MemorizerApp user={user} username={userProfile.displayUsername} onSignOut={handleSignOut} />;
}

export default App;