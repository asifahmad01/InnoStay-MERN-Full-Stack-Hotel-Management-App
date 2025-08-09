// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'    // ← pulls in Tailwind
import App from './App';
import AuthProvider from './contexts/AuthProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
