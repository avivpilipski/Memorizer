import React from 'react';
import { MemorizerApp } from './components/MemorizerApp';
import { AuthService } from './services/AuthService';

// Initialize services
const authService = new AuthService();

function App() {
  // Handle authentication state
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = authService.auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-pulse text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {!user ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold text-indigo-900 mb-8">Welcome to Memorizer</h1>
          <button
            onClick={() => authService.signInWithGoogle()}
            className="btn-primary flex items-center gap-2"
          >
            <img 
              src="/api/placeholder/20/20"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
        </div>
      ) : (
        <MemorizerApp user={user} />
      )}
    </div>
  );
}

export default App;