// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';

console.log('Starting app initialization...');

// Wrap the app initialization in a try-catch
try {
  console.log('Importing Firebase...');
  require('./firebase');
  console.log('Firebase imported successfully');
  
  console.log('Importing App component...');
  const App = require('./App').default;
  console.log('App component imported successfully');

  const container = document.getElementById('root');
  const root = createRoot(container);

  console.log('Rendering app...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('App rendered successfully');

} catch (error) {
  console.error('Error in app initialization:', error);
  document.body.innerHTML = `
    <div style="color: red; padding: 20px;">
      Error initializing app. Check console for details.
    </div>
  `;
}